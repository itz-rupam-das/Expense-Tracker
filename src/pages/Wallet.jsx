import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Plus, Pencil, Trash2, X, Check, Filter } from 'lucide-react';
import './Wallet.css';

export default function Wallet() {
    const { expenses, settings, addExpense, editExpense, deleteExpense } = useExpenses();
    const sym = settings.currencySymbol;

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');

    const [formData, setFormData] = useState({
        amount: '',
        category: settings.categories[0] || 'Food',
        date: new Date().toISOString().split('T')[0],
        note: '',
    });

    const resetForm = () => {
        setFormData({
            amount: '',
            category: settings.categories[0] || 'Food',
            date: new Date().toISOString().split('T')[0],
            note: '',
        });
        setShowForm(false);
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || Number(formData.amount) <= 0) return;

        if (editingId) {
            editExpense({ ...formData, id: editingId });
        } else {
            addExpense(formData);
        }
        resetForm();
    };

    const handleEdit = (expense) => {
        setFormData({
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            note: expense.note || '',
        });
        setEditingId(expense.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        deleteExpense(id);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const filteredExpenses = [...expenses]
        .filter((e) => filterCategory === 'All' || e.category === filterCategory)
        .sort((a, b) => new Date(b.date) - new Date(a.date) || Number(b.id) - Number(a.id));

    const totalFiltered = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    return (
        <div className="page-container" id="wallet-page">
            <div className="wallet-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Wallet</span>
                    </h1>
                    <p className="page-subtitle">Manage your expenses</p>
                </div>
                <button
                    className="btn-primary add-expense-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    id="add-expense-btn"
                >
                    <Plus size={18} />
                    Add Expense
                </button>
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
                            <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
                            <button type="button" className="btn-icon" onClick={resetForm}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="form-grid">
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
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary" id="save-expense-btn">
                                <Check size={16} />
                                {editingId ? 'Update' : 'Add Expense'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter & Summary */}
            <div className="wallet-controls glass-card">
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
                </div>
                <div className="wallet-summary">
                    <span className="summary-label">{filteredExpenses.length} transactions</span>
                    <span className="summary-total">Total: {sym}{totalFiltered.toLocaleString()}</span>
                </div>
            </div>

            {/* Expense List */}
            {filteredExpenses.length > 0 ? (
                <div className="expense-list">
                    {filteredExpenses.map((expense, i) => (
                        <div
                            key={expense.id}
                            className="expense-row glass-card"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="expense-info">
                                <div className="expense-main">
                                    <span className="expense-category-badge">{expense.category}</span>
                                    <span className="expense-amount">{sym}{Number(expense.amount).toLocaleString()}</span>
                                </div>
                                <div className="expense-meta">
                                    <span className="expense-date">
                                        {new Date(expense.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    {expense.note && <span className="expense-note">• {expense.note}</span>}
                                </div>
                            </div>
                            <div className="expense-actions">
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
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <p>No expenses found. Click "Add Expense" to get started!</p>
                </div>
            )}
        </div>
    );
}
