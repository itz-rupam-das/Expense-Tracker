import { createContext, useContext, useReducer, useEffect } from 'react';

const ExpenseContext = createContext();

const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other'];

const DEFAULT_SETTINGS = {
    dailyLimit: 500,
    currency: 'INR',
    currencySymbol: '₹',
    categories: DEFAULT_CATEGORIES,
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

    useEffect(() => {
        localStorage.setItem('et_expenses', JSON.stringify(state.expenses));
    }, [state.expenses]);

    useEffect(() => {
        localStorage.setItem('et_settings', JSON.stringify(state.settings));
    }, [state.settings]);

    const addExpense = (expense) =>
        dispatch({ type: 'ADD_EXPENSE', payload: expense });

    const editExpense = (expense) =>
        dispatch({ type: 'EDIT_EXPENSE', payload: expense });

    const deleteExpense = (id) =>
        dispatch({ type: 'DELETE_EXPENSE', payload: id });

    const updateSettings = (settings) =>
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });

    const clearAll = () => dispatch({ type: 'CLEAR_ALL' });

    // ---- Computed values ----
    const getTodayTotal = () => {
        const today = getToday();
        return state.expenses
            .filter((e) => e.date === today)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getWeeklyTotal = () => {
        const start = getStartOfWeek();
        return state.expenses
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getMonthlyTotal = () => {
        const start = getStartOfMonth();
        return state.expenses
            .filter((e) => e.date >= start)
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getRemainingLimit = () => {
        return state.settings.dailyLimit - getTodayTotal();
    };

    const isLimitExceeded = () => {
        return getTodayTotal() > state.settings.dailyLimit;
    };

    const getCategoryBreakdown = () => {
        const breakdown = {};
        state.expenses.forEach((e) => {
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
        state.expenses.forEach((e) => {
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
            const startStr = start.toISOString().split('T')[0];
            const endStr = end.toISOString().split('T')[0];
            const total = state.expenses
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
            const startStr = new Date(year, month, 1).toISOString().split('T')[0];
            const endStr = new Date(year, month + 1, 0).toISOString().split('T')[0];
            const total = state.expenses
                .filter((e) => e.date >= startStr && e.date <= endStr)
                .reduce((sum, e) => sum + Number(e.amount), 0);
            data[label] = total;
        }
        return data;
    };

    const value = {
        expenses: state.expenses,
        settings: state.settings,
        addExpense,
        editExpense,
        deleteExpense,
        updateSettings,
        clearAll,
        getTodayTotal,
        getWeeklyTotal,
        getMonthlyTotal,
        getRemainingLimit,
        isLimitExceeded,
        getCategoryBreakdown,
        getRecentExpenses,
        getDailyData,
        getWeeklyData,
        getMonthlyData,
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
