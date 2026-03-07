import { createContext, useContext, useReducer, useEffect } from 'react';

const ExpenseContext = createContext();

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'];

const DEFAULT_SETTINGS = {
    dailyLimit: 500,
    currency: 'INR',
    currencySymbol: '₹',
    categories: DEFAULT_CATEGORIES,
    categoryBudgets: {},
};

function loadFromStorage(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
}

const initialState = {
    expenses: loadFromStorage('et_expenses', []),
    settings: loadFromStorage('et_settings', DEFAULT_SETTINGS),
};

function expenseReducer(state, action) {
    switch (action.type) {
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [
                    ...state.expenses,
                    { ...action.payload, id: Date.now().toString() },
                ],
            };
        case 'EDIT_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.map((exp) =>
                    exp.id === action.payload.id ? { ...exp, ...action.payload } : exp
                ),
            };
        case 'DELETE_EXPENSE':
            return {
                ...state,
                expenses: state.expenses.filter((exp) => exp.id !== action.payload),
            };
        case 'RESTORE_EXPENSE':
            return {
                ...state,
                expenses: [...state.expenses, action.payload],
            };
        case 'IMPORT_DATA':
            return {
                ...state,
                expenses: action.payload.expenses || [],
                settings: { ...DEFAULT_SETTINGS, ...(action.payload.settings || {}) },
            };
        case 'UPDATE_SETTINGS':
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
            };
        case 'CLEAR_ALL':
            return {
                expenses: [],
                settings: DEFAULT_SETTINGS,
            };
        default:
            return state;
    }
}

// ---- Helper date functions (local timezone) ----
function toLocalDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getToday() {
    return toLocalDateStr(new Date());
}

function getStartOfWeek() {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return toLocalDateStr(monday);
}

function getStartOfMonth() {
    const d = new Date();
    return toLocalDateStr(new Date(d.getFullYear(), d.getMonth(), 1));
}

// ---- Context Provider ----
export function ExpenseProvider({ children }) {
    const [state, dispatch] = useReducer(expenseReducer, initialState);

    // Ensure settings has categoryBudgets (migration for existing data)
    useEffect(() => {
        if (!state.settings.categoryBudgets) {
            dispatch({ type: 'UPDATE_SETTINGS', payload: { categoryBudgets: {} } });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('et_expenses', JSON.stringify(state.expenses));
    }, [state.expenses]);

    useEffect(() => {
        localStorage.setItem('et_settings', JSON.stringify(state.settings));
    }, [state.settings]);

    // Auto-add recurring expenses on mount
    useEffect(() => {
        const today = getToday();
        const recurringExpenses = state.expenses.filter((e) => e.recurring && e.recurrenceFrequency);

        recurringExpenses.forEach((expense) => {
            const lastDate = new Date(expense.date);
            const now = new Date();
            let nextDate = new Date(lastDate);

            if (expense.recurrenceFrequency === 'daily') {
                nextDate.setDate(nextDate.getDate() + 1);
            } else if (expense.recurrenceFrequency === 'weekly') {
                nextDate.setDate(nextDate.getDate() + 7);
            } else if (expense.recurrenceFrequency === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            }

            while (toLocalDateStr(nextDate) <= today && nextDate <= now) {
                const dateStr = toLocalDateStr(nextDate);
                const alreadyExists = state.expenses.some(
                    (e) => e.recurringParentId === expense.id && e.date === dateStr
                );
                if (!alreadyExists) {
                    dispatch({
                        type: 'ADD_EXPENSE',
                        payload: {
                            amount: expense.amount,
                            category: expense.category,
                            date: dateStr,
                            note: expense.note ? `${expense.note} (recurring)` : '(recurring)',
                            type: expense.type || 'expense',
                            recurringParentId: expense.id,
                        },
                    });
                }
                if (expense.recurrenceFrequency === 'daily') {
                    nextDate.setDate(nextDate.getDate() + 1);
                } else if (expense.recurrenceFrequency === 'weekly') {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (expense.recurrenceFrequency === 'monthly') {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }
            }
        });
    }, []); // only on mount

    const addExpense = (expense) =>
        dispatch({ type: 'ADD_EXPENSE', payload: expense });

    const editExpense = (expense) =>
        dispatch({ type: 'EDIT_EXPENSE', payload: expense });

    const deleteExpense = (id) =>
        dispatch({ type: 'DELETE_EXPENSE', payload: id });

    const restoreExpense = (expense) =>
        dispatch({ type: 'RESTORE_EXPENSE', payload: expense });

    const importData = (data) =>
        dispatch({ type: 'IMPORT_DATA', payload: data });

    const updateSettings = (settings) =>
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });

    const clearAll = () => dispatch({ type: 'CLEAR_ALL' });

    // ---- Currency formatter ----
    const formatCurrency = (amount) => {
        return `${state.settings.currencySymbol}${Number(amount).toLocaleString()}`;
    };

    // ---- Computed values ----
    const getExpensesOnly = () => state.expenses.filter((e) => (e.type || 'expense') === 'expense');
    const getIncomeOnly = () => state.expenses.filter((e) => e.type === 'income');

    const getTodayTotal = () => {
        const today = getToday();
        return getExpensesOnly()
            .filter((e) => e.date === today)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getTodayIncome = () => {
        const today = getToday();
        return getIncomeOnly()
            .filter((e) => e.date === today)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getWeeklyTotal = () => {
        const start = getStartOfWeek();
        return getExpensesOnly()
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getWeeklyIncome = () => {
        const start = getStartOfWeek();
        return getIncomeOnly()
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getMonthlyTotal = () => {
        const start = getStartOfMonth();
        return getExpensesOnly()
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getMonthlyIncome = () => {
        const start = getStartOfMonth();
        return getIncomeOnly()
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getNetBalance = () => {
        const totalIncome = getIncomeOnly().reduce((sum, e) => sum + Number(e.amount), 0);
        const totalExpense = getExpensesOnly().reduce((sum, e) => sum + Number(e.amount), 0);
        return totalIncome - totalExpense;
    };

    const getRemainingLimit = () => {
        return state.settings.dailyLimit - getTodayTotal();
    };

    const isLimitExceeded = () => {
        return getTodayTotal() > state.settings.dailyLimit;
    };

    const getCategoryBreakdown = () => {
        const breakdown = {};
        getExpensesOnly().forEach((e) => {
            breakdown[e.category] = (breakdown[e.category] || 0) + Number(e.amount);
        });
        return breakdown;
    };

    const getCategoryMonthlySpending = () => {
        const start = getStartOfMonth();
        const breakdown = {};
        getExpensesOnly()
            .filter((e) => e.date >= start)
            .forEach((e) => {
                breakdown[e.category] = (breakdown[e.category] || 0) + Number(e.amount);
            });
        return breakdown;
    };

    const getRecentExpenses = (count = 5) => {
        return [...state.expenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date) || Number(b.id) - Number(a.id))
            .slice(0, count);
    };

    const getDailyData = (days = 7) => {
        const data = {};
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = toLocalDateStr(d);
            data[key] = 0;
        }
        getExpensesOnly().forEach((e) => {
            if (data[e.date] !== undefined) {
                data[e.date] += Number(e.amount);
            }
        });
        return data;
    };

    const getWeeklyData = (weeks = 4) => {
        const data = {};
        for (let i = weeks - 1; i >= 0; i--) {
            const end = new Date();
            end.setDate(end.getDate() - i * 7);
            const start = new Date(end);
            start.setDate(start.getDate() - 6);
            const label = `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
            const startStr = toLocalDateStr(start);
            const endStr = toLocalDateStr(end);
            const total = getExpensesOnly()
                .filter((e) => e.date >= startStr && e.date <= endStr)
                .reduce((sum, e) => sum + Number(e.amount), 0);
            data[label] = total;
        }
        return data;
    };

    const getMonthlyData = (months = 6) => {
        const data = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth();
            const label = `${monthNames[month]} ${year}`;
            const startStr = toLocalDateStr(new Date(year, month, 1));
            const endStr = toLocalDateStr(new Date(year, month + 1, 0));
            const total = getExpensesOnly()
                .filter((e) => e.date >= startStr && e.date <= endStr)
                .reduce((sum, e) => sum + Number(e.amount), 0);
            data[label] = total;
        }
        return data;
    };

    // Income vs Expense monthly data for Reports chart
    const getIncomeVsExpenseMonthly = (months = 6) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        const incomeData = [];
        const expenseData = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth();
            labels.push(`${monthNames[month]} ${year}`);
            const startStr = toLocalDateStr(new Date(year, month, 1));
            const endStr = toLocalDateStr(new Date(year, month + 1, 0));
            incomeData.push(
                getIncomeOnly()
                    .filter((e) => e.date >= startStr && e.date <= endStr)
                    .reduce((sum, e) => sum + Number(e.amount), 0)
            );
            expenseData.push(
                getExpensesOnly()
                    .filter((e) => e.date >= startStr && e.date <= endStr)
                    .reduce((sum, e) => sum + Number(e.amount), 0)
            );
        }
        return { labels, incomeData, expenseData };
    };

    // Insights helpers
    const getLastWeekTotal = () => {
        const d = new Date();
        const day = d.getDay();
        const endOfLastWeek = new Date(d);
        endOfLastWeek.setDate(d.getDate() - day + (day === 0 ? -7 : 0));
        const startOfLastWeek = new Date(endOfLastWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);
        const startStr = toLocalDateStr(startOfLastWeek);
        const endStr = toLocalDateStr(endOfLastWeek);
        return getExpensesOnly()
            .filter((e) => e.date >= startStr && e.date <= endStr)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getHighestSpendingDay = () => {
        const start = getStartOfMonth();
        const dayMap = {};
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        getExpensesOnly()
            .filter((e) => e.date >= start)
            .forEach((e) => {
                const dayOfWeek = new Date(e.date + 'T00:00:00').getDay();
                const name = dayNames[dayOfWeek];
                dayMap[name] = (dayMap[name] || 0) + Number(e.amount);
            });
        let maxDay = null;
        let maxVal = 0;
        Object.entries(dayMap).forEach(([day, val]) => {
            if (val > maxVal) {
                maxDay = day;
                maxVal = val;
            }
        });
        return maxDay;
    };

    const getInsights = () => {
        const insights = [];
        const thisWeek = getWeeklyTotal();
        const lastWeek = getLastWeekTotal();
        if (lastWeek > 0 && thisWeek > 0) {
            const pctChange = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
            if (pctChange > 0) {
                insights.push(`📈 You spent ${pctChange}% more this week compared to last week.`);
            } else if (pctChange < 0) {
                insights.push(`📉 You spent ${Math.abs(pctChange)}% less this week compared to last week. Great job!`);
            } else {
                insights.push(`📊 Your spending this week is about the same as last week.`);
            }
        }

        const highestDay = getHighestSpendingDay();
        if (highestDay) {
            insights.push(`📅 Your highest spending day this month is ${highestDay}.`);
        }

        const budgets = state.settings.categoryBudgets || {};
        const monthlySpending = getCategoryMonthlySpending();
        Object.entries(budgets).forEach(([cat, budget]) => {
            if (budget > 0 && monthlySpending[cat]) {
                const spent = monthlySpending[cat];
                if (spent > budget) {
                    insights.push(`🚨 ${cat} has exceeded its monthly budget (${formatCurrency(spent)} / ${formatCurrency(budget)}).`);
                } else if (spent >= budget * 0.8) {
                    insights.push(`⚠️ ${cat} is approaching its monthly budget (${formatCurrency(spent)} / ${formatCurrency(budget)}).`);
                }
            }
        });

        if (insights.length === 0) {
            insights.push('💡 Add more expenses to see personalized spending insights!');
        }

        return insights;
    };

    const value = {
        expenses: state.expenses,
        settings: state.settings,
        addExpense,
        editExpense,
        deleteExpense,
        restoreExpense,
        importData,
        updateSettings,
        clearAll,
        formatCurrency,
        getTodayTotal,
        getTodayIncome,
        getWeeklyTotal,
        getWeeklyIncome,
        getMonthlyTotal,
        getMonthlyIncome,
        getNetBalance,
        getRemainingLimit,
        isLimitExceeded,
        getCategoryBreakdown,
        getCategoryMonthlySpending,
        getRecentExpenses,
        getDailyData,
        getWeeklyData,
        getMonthlyData,
        getIncomeVsExpenseMonthly,
        getInsights,
    };

    return (
        <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
}
