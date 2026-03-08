import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

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
    expenses: [],
    settings: loadFromStorage('et_settings', DEFAULT_SETTINGS),
};

function expenseReducer(state, action) {
    switch (action.type) {
        case 'SET_EXPENSES':
            return {
                ...state,
                expenses: action.payload,
            };
        case 'ADD_EXPENSE':
            return {
                ...state,
                expenses: [
                    ...state.expenses,
                    action.payload,
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
                ...state,
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
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Fetch initial transactions from Supabase
    useEffect(() => {
        async function fetchExpenses() {
            if (!user) {
                dispatch({ type: 'SET_EXPENSES', payload: [] });
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id);

                if (error) throw error;

                const mappedData = (data || []).map(item => ({
                    ...item,
                    note: item.notes || ''
                }));

                dispatch({ type: 'SET_EXPENSES', payload: mappedData });
            } catch (err) {
                console.error("Error fetching transactions:", err);
                alert("Failed to load transactions: " + err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchExpenses();
    }, [user]);

    // Ensure settings has categoryBudgets (migration for existing data)
    useEffect(() => {
        if (!state.settings.categoryBudgets) {
            dispatch({ type: 'UPDATE_SETTINGS', payload: { categoryBudgets: {} } });
        }
    }, [state.settings.categoryBudgets]);

    useEffect(() => {
        localStorage.setItem('et_settings', JSON.stringify(state.settings));
    }, [state.settings]);

    // Auto-add recurring expenses (simplified for now to avoid side-effects on load,
    // actual recurring logic would ideally run via a cron job on Supabase)

    const addExpense = async (expense) => {
        if (!user) return;
        const dbPayload = {
            amount: Number(expense.amount),
            category: expense.category,
            type: expense.type || 'expense',
            date: expense.date,
            notes: expense.note || expense.notes || '',
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('transactions')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add transaction: " + error.message);
            return;
        }

        const localExpense = {
            ...data,
            note: data.notes
        };
        dispatch({ type: 'ADD_EXPENSE', payload: localExpense });
    };

    const editExpense = async (expense) => {
        if (!user) return;

        const dbUpdates = {
            amount: Number(expense.amount),
            category: expense.category,
            type: expense.type || 'expense',
            date: expense.date,
            notes: expense.note || expense.notes || ''
        };

        const { data, error } = await supabase
            .from('transactions')
            .update(dbUpdates)
            .eq('id', expense.id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating expense:", error);
            alert("Failed to update transaction: " + error.message);
            return;
        }

        const localExpense = {
            ...data,
            note: data.notes
        };
        dispatch({ type: 'EDIT_EXPENSE', payload: localExpense });
    };

    const deleteExpense = async (id) => {
        if (!user) return;

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error("Error deleting expense:", error);
            alert("Failed to delete transaction: " + error.message);
            return;
        }
        dispatch({ type: 'DELETE_EXPENSE', payload: id });
    };

    const restoreExpense = async (expense) => {
        if (!user) return;

        const dbPayload = {
            amount: Number(expense.amount),
            category: expense.category,
            type: expense.type || 'expense',
            date: expense.date,
            notes: expense.note || expense.notes || '',
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('transactions')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error("Error restoring expense:", error);
            alert("Failed to restore transaction: " + error.message);
            return;
        }

        const localExpense = {
            ...data,
            note: data.notes
        };
        dispatch({ type: 'RESTORE_EXPENSE', payload: localExpense });
    };

    const importData = (data) =>
        dispatch({ type: 'IMPORT_DATA', payload: data });

    const updateSettings = (settings) =>
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });

    const clearAll = async () => {
        if (!user) return;

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('user_id', user.id);

        if (!error) {
            dispatch({ type: 'CLEAR_ALL' });
        }
    };

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
        isLoading,
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
