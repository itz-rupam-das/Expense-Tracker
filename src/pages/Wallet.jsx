import { useState, useEffect, useCallback } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Plus, Pencil, Trash2, X, Check, Filter, Search, Download, Undo2 } from 'lucide-react';
import './Wallet.css';

function getLocalDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function Wallet() {
    const { expenses, settings, addExpense, editExpense, deleteExpense, restoreExpense, formatCurrency } = useExpenses();
    const sym = settings.currencySymbol;

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Undo delete state
    const [deletedExpense, setDeletedExpense] = useState(null);
    const [showUndoToast, setShowUndoToast] = useState(false);
    const [undoTimer, setUndoTimer] = useState(null);

    // Inline editing state
    const [inlineEditId, setInlineEditId] = useState(null);
    const [inlineData, setInlineData] = useState({});

    const [formData, setFormData] = useState({
        amount: '',
        category: settings.categories[0] || 'Food',
        date: getLocalDate(),
        note: '',
        type: 'expense',
        recurring: false,
        recurrenceFrequency: '',
    });

    const resetForm = () => {
        setFormData({
            amount: '',
            category: settings.categories[0] || 'Food',
            date: getLocalDate(),
            note: '',
            type: 'expense',
            recurring: false,
            recurrenceFrequency: '',
        });
        setShowForm(false);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || Number(formData.amount) <= 0) return;

        const payload = { ...formData };
        if (!payload.recurring) {
            delete payload.recurrenceFrequency;
        }

        if (editingId) {
            editExpense({ ...payload, id: editingId });
        } else {
            addExpense(payload);
        }
        resetForm();
    };

    const handleEdit = (expense) => {
        setFormData({
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            note: expense.note || '',
            type: expense.type || 'expense',
            recurring: expense.recurring || false,
            recurrenceFrequency: expense.recurrenceFrequency || '',
        });
        setEditingId(expense.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        const toDelete = expenses.find((e) => e.id === id);
        if (toDelete) {
            deleteExpense(id);
            setDeletedExpense(toDelete);
            setShowUndoToast(true);

            if (undoTimer) clearTimeout(undoTimer);
            const timer = setTimeout(() => {
                setShowUndoToast(false);
                setDeletedExpense(null);
            }, 5000);
            setUndoTimer(timer);
        }
    };

    const handleUndo = () => {
        if (deletedExpense) {
            restoreExpense(deletedExpense);
            setDeletedExpense(null);
            setShowUndoToast(false);
            if (undoTimer) clearTimeout(undoTimer);
        }
    };

    // Keyboard shortcut: Ctrl+Z for undo
    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === 'z' && deletedExpense && showUndoToast) {
            e.preventDefault();
            handleUndo();
        }
    }, [deletedExpense, showUndoToast]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Inline edit handlers
    const startInlineEdit = (expense) => {
        setInlineEditId(expense.id);
        setInlineData({
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            note: expense.note || '',
            type: expense.type || 'expense',
        });
    };

    const saveInlineEdit = () => {
        if (inlineEditId && inlineData.amount && Number(inlineData.amount) > 0) {
            editExpense({ ...inlineData, id: inlineEditId });
        }
        setInlineEditId(null);
        setInlineData({});
    };

    const cancelInlineEdit = () => {
        setInlineEditId(null);
        setInlineData({});
    };

    // CSV Export
    const exportCSV = () => {
        const headers = ['Date', 'Category', 'Amount', 'Type', 'Notes'];
        const rows = filteredExpenses.map((e) => [
            e.date,
            e.category,
            e.amount,
            e.type || 'expense',
            `"${(e.note || '').replace(/"/g, '""')}"`,
        ]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expenses_${getLocalDate()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Filtering
    const filteredExpenses = [...expenses]
        .filter((e) => filterCategory === 'All' || e.category === filterCategory)
        .filter((e) => filterType === 'All' || (e.type || 'expense') === filterType)
        .filter((e) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (e.note || '').toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
        })
        .filter((e) => {
            if (dateFrom && e.date < dateFrom) return false;
            if (dateTo && e.date > dateTo) return false;
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date) || Number(b.id) - Number(a.id));

    const totalFiltered = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="page-container" id="wallet-page">
            <div className="wallet-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Wallet</span>
                    </h1>
                    <p className="page-subtitle">Manage your expenses & income</p>
                </div>
                <div className="wallet-header-actions">
                    <button
                        className="btn-secondary export-csv-btn"
                        onClick={exportCSV}
                        title="Export to CSV"
                        id="export-csv-btn"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button
                        className="btn-primary add-expense-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        id="add-expense-btn"
                    >
                        <Plus size={18} />
                        Add Transaction
                    </button>
                </div>
            </div>

            {/* Expense Form Modal */}
            {showForm && (
                <div className="form-overlay" onClick={resetForm}>
                    <form
                        className="expense-form glass-card"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSubmit}
                        id="expense-form"
                    >
                        <div className="form-header">
                            <h3>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h3>
                            <button type="button" className="btn-icon" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="input-label" htmlFor="expense-type">Type</label>
                                <select
                                    id="expense-type"
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="input-label" htmlFor="expense-amount">Amount ({sym})</label>
                                <input
                                    type="number"
                                    id="expense-amount"
                                    className="input-field"
                                    placeholder="Enter amount"
                                    value={formData.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                    min="0"
                                    step="1"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label" htmlFor="expense-category">Category</label>
                                <select
                                    id="expense-category"
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    {settings.categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="input-label" htmlFor="expense-date">Date</label>
                                <input
                                    type="date"
                                    id="expense-date"
                                    className="input-field"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label" htmlFor="expense-note">Notes</label>
                                <input
                                    type="text"
                                    id="expense-note"
                                    className="input-field"
                                    placeholder="Optional description"
                                    value={formData.note}
                                    onChange={(e) => handleChange('note', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="input-label recurring-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.recurring}
                                        onChange={(e) => handleChange('recurring', e.target.checked)}
                                        className="recurring-checkbox"
                                    />
                                    Mark as Recurring
                                </label>
                                {formData.recurring && (
                                    <select
                                        className="input-field"
                                        value={formData.recurrenceFrequency}
                                        onChange={(e) => handleChange('recurrenceFrequency', e.target.value)}
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <option value="">Select frequency</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" id="save-expense-btn">
                                <Check size={16} />
                                {editingId ? 'Update' : 'Add Transaction'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter & Search Controls */}
            <div className="wallet-controls glass-card">
                <div className="controls-top-row">
                    <div className="search-group">
                        <Search size={16} />
                        <input
                            type="text"
                            className="input-field search-input"
                            placeholder="Search by notes or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="wallet-search"
                        />
                    </div>
                    <div className="filter-group">
                        <Filter size={16} />
                        <select
                            className="input-field filter-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            id="category-filter"
                        >
                            <option value="All">All Categories</option>
                            {settings.categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            className="input-field filter-select type-filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            id="type-filter"
                        >
                            <option value="All">All Types</option>
                            <option value="expense">Expenses</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>
                <div className="controls-bottom-row">
                    <div className="date-range-group">
                        <label className="date-range-label">From:</label>
                        <input
                            type="date"
                            className="input-field date-input"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            id="date-from"
                        />
                        <label className="date-range-label">To:</label>
                        <input
                            type="date"
                            className="input-field date-input"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            id="date-to"
                        />
                    </div>
                    <div className="wallet-summary">
                        <span className="summary-label">{filteredExpenses.length} transactions</span>
                        <span className="summary-total">Total: {sym}{totalFiltered.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Expense List */}
            {filteredExpenses.length > 0 ? (
                <div className="expense-list">
                    {filteredExpenses.map((expense, i) => (
                        <div
                            key={expense.id}
                            className={`expense-row glass-card ${inlineEditId === expense.id ? 'inline-editing' : ''}`}
                            style={{ animationDelay: `${i * 50}ms` }}
                            onClick={() => {
                                if (!inlineEditId && inlineEditId !== expense.id) {
                                    startInlineEdit(expense);
                                }
                            }}
                        >
                            {inlineEditId === expense.id ? (
                                /* Inline Edit Mode */
                                <div className="inline-edit-form">
                                    <div className="inline-edit-fields">
                                        <input
                                            type="number"
                                            className="input-field inline-input"
                                            value={inlineData.amount}
                                            onChange={(e) => setInlineData({ ...inlineData, amount: e.target.value })}
                                            min="0"
                                            placeholder="Amount"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveInlineEdit();
                                                if (e.key === 'Escape') cancelInlineEdit();
                                            }}
                                        />
                                        <select
                                            className="input-field inline-input"
                                            value={inlineData.category}
                                            onChange={(e) => setInlineData({ ...inlineData, category: e.target.value })}
                                        >
                                            {settings.categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="date"
                                            className="input-field inline-input"
                                            value={inlineData.date}
                                            onChange={(e) => setInlineData({ ...inlineData, date: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="input-field inline-input"
                                            value={inlineData.note}
                                            onChange={(e) => setInlineData({ ...inlineData, note: e.target.value })}
                                            placeholder="Notes"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveInlineEdit();
                                                if (e.key === 'Escape') cancelInlineEdit();
                                            }}
                                        />
                                    </div>
                                    <div className="inline-edit-actions">
                                        <button
                                            className="btn-primary btn-sm"
                                            onClick={(e) => { e.stopPropagation(); saveInlineEdit(); }}
                                        >
                                            <Check size={14} /> Save
                                        </button>
                                        <button
                                            className="btn-secondary btn-sm"
                                            onClick={(e) => { e.stopPropagation(); cancelInlineEdit(); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <>
                                    <div className="expense-info">
                                        <div className="expense-main">
                                            <span className="expense-category-badge">
                                                {expense.category}
                                            </span>
                                            {expense.recurring && <span className="recurring-tag">🔄 Recurring</span>}
                                            {(expense.type || 'expense') === 'income' && (
                                                <span className="income-tag">Income</span>
                                            )}
                                            <span
                                                className="expense-amount"
                                                style={{
                                                    color: (expense.type || 'expense') === 'income' ? '#34d399' : undefined,
                                                }}
                                            >
                                                {(expense.type || 'expense') === 'income' ? '+' : '-'}
                                                {sym}{Number(expense.amount).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="expense-meta">
                                            <span className="expense-date">
                                                {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            {expense.note && <span className="expense-note">• {expense.note}</span>}
                                        </div>
                                    </div>
                                    <div className="expense-actions" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleEdit(expense)}
                                            aria-label="Edit expense"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="btn-icon delete-btn"
                                            onClick={() => handleDelete(expense.id)}
                                            aria-label="Delete expense"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">💸</div>
                    <p>No transactions found. Click "Add Transaction" to get started!</p>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        <Plus size={16} /> Add Your First Transaction
                    </button>
                </div>
            )}

            {/* Undo Delete Toast */}
            {showUndoToast && deletedExpense && (
                <div className="undo-toast">
                    <span>Expense deleted — </span>
                    <button className="undo-btn" onClick={handleUndo}>
                        <Undo2 size={14} /> Undo
                    </button>
                    <span className="undo-hint">(Ctrl+Z)</span>
                </div>
            )}
        </div>
    );
}
