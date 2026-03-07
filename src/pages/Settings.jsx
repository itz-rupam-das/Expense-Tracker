import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useTheme } from '../context/ThemeContext';
import { Save, Plus, X, Trash2, AlertTriangle, Sun, Moon } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const { settings, updateSettings, clearAll } = useExpenses();
    const { theme, toggleTheme } = useTheme();

    const [dailyLimit, setDailyLimit] = useState(settings.dailyLimit);
    const [currency, setCurrency] = useState(settings.currency);
    const [newCategory, setNewCategory] = useState('');
    const [saved, setSaved] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const currencyOptions = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
    ];

    const handleSaveLimitCurrency = () => {
        const selectedCurrency = currencyOptions.find((c) => c.code === currency);
        updateSettings({
            dailyLimit: Number(dailyLimit),
            currency: currency,
            currencySymbol: selectedCurrency?.symbol || '₹',
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !settings.categories.includes(trimmed)) {
            updateSettings({
                categories: [...settings.categories, trimmed],
            });
            setNewCategory('');
        }
    };

    const handleRemoveCategory = (cat) => {
        updateSettings({
            categories: settings.categories.filter((c) => c !== cat),
        });
    };

    const handleClearAll = () => {
        clearAll();
        setDailyLimit(500);
        setCurrency('INR');
        setShowClearConfirm(false);
    };

    return (
        <div className="page-container" id="settings-page">
            <h1 className="page-title">
                <span className="gradient-text">Settings</span>
            </h1>
            <p className="page-subtitle">Configure your preferences</p>

            <div className="settings-grid">
                {/* Theme Toggle */}
                <div className="settings-card glass-card theme-card">
                    <h3 className="section-title">Appearance</h3>
                    <div className="theme-toggle-row">
                        <div className="theme-info">
                            <span className="theme-label">
                                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <span className="theme-desc">
                                Switch between light and dark themes
                            </span>
                        </div>
                        <button
                            className="theme-toggle-btn"
                            onClick={toggleTheme}
                            id="theme-toggle-btn"
                            aria-label="Toggle theme"
                        >
                            <span className={`toggle-track ${theme}`}>
                                <span className="toggle-thumb">
                                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Daily Limit & Currency */}
                <div className="settings-card glass-card">
                    <h3 className="section-title">Spending Limit & Currency</h3>

                    {saved && (
                        <div className="save-success">
                            ✅ Settings saved successfully!
                        </div>
                    )}

                    <div className="settings-form-group">
                        <label className="input-label" htmlFor="daily-limit">
                            Daily Spending Limit ({currencyOptions.find((c) => c.code === currency)?.symbol || '₹'})
                        </label>
                        <input
                            type="number"
                            id="daily-limit"
                            className="input-field"
                            value={dailyLimit}
                            onChange={(e) => setDailyLimit(e.target.value)}
                            min="0"
                            step="50"
                        />
                    </div>

                    <div className="settings-form-group">
                        <label className="input-label" htmlFor="currency-select">Currency</label>
                        <select
                            id="currency-select"
                            className="input-field"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            {currencyOptions.map((c) => (
                                <option key={c.code} value={c.code}>
                                    {c.symbol} {c.name} ({c.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="btn-primary" onClick={handleSaveLimitCurrency} id="save-settings-btn">
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>

                {/* Category Management */}
                <div className="settings-card glass-card">
                    <h3 className="section-title">Manage Categories</h3>

                    <div className="add-category-row">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="New category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            id="new-category-input"
                        />
                        <button className="btn-primary" onClick={handleAddCategory} id="add-category-btn">
                            <Plus size={16} />
                            Add
                        </button>
                    </div>

                    <div className="category-list">
                        {settings.categories.map((cat) => (
                            <div key={cat} className="category-chip">
                                <span>{cat}</span>
                                <button
                                    className="chip-remove"
                                    onClick={() => handleRemoveCategory(cat)}
                                    aria-label={`Remove ${cat}`}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-card glass-card danger-zone">
                    <h3 className="section-title danger-title">
                        <AlertTriangle size={20} /> Danger Zone
                    </h3>
                    <p className="danger-desc">
                        Clear all your expense data and reset settings to defaults. This action cannot be undone.
                    </p>

                    {!showClearConfirm ? (
                        <button
                            className="btn-danger"
                            onClick={() => setShowClearConfirm(true)}
                            id="clear-data-btn"
                        >
                            <Trash2 size={16} />
                            Clear All Data
                        </button>
                    ) : (
                        <div className="confirm-actions">
                            <p className="confirm-text">Are you sure? This will delete everything.</p>
                            <div className="confirm-buttons">
                                <button className="btn-secondary" onClick={() => setShowClearConfirm(false)}>
                                    Cancel
                                </button>
                                <button className="btn-danger" onClick={handleClearAll} id="confirm-clear-btn">
                                    Yes, Clear Everything
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
