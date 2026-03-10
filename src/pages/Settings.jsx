import { useState, useRef } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Save, Plus, X, Trash2, AlertTriangle, Download, Upload } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const { settings, expenses, updateSettings, clearAll, importData } = useExpenses();

    const [dailyLimit, setDailyLimit] = useState(settings.dailyLimit);
    const [currency, setCurrency] = useState(settings.currency);
    const [newCategory, setNewCategory] = useState('');
    const [saved, setSaved] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importError, setImportError] = useState('');
    const [importSuccess, setImportSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Category budgets state
    const [categoryBudgets, setCategoryBudgets] = useState(settings.categoryBudgets || {});

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

    const handleSaveBudgets = () => {
        updateSettings({ categoryBudgets });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleBudgetChange = (cat, value) => {
        setCategoryBudgets((prev) => ({
            ...prev,
            [cat]: Number(value) || 0,
        }));
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
        // Also remove budget for that category
        const newBudgets = { ...categoryBudgets };
        delete newBudgets[cat];
        setCategoryBudgets(newBudgets);
    };

    const handleClearAll = () => {
        clearAll();
        setDailyLimit(500);
        setCurrency('INR');
        setCategoryBudgets({});
        setShowClearConfirm(false);
    };

    // Backup: Export JSON
    const handleExportJSON = () => {
        const data = {
            expenses,
            settings,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const d = new Date();
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        link.download = `expense_tracker_backup_${dateStr}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Restore: Import JSON
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImportFile(file);
            setShowImportConfirm(true);
            setImportError('');
        }
    };

    const handleImportJSON = () => {
        if (!importFile) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.expenses || !Array.isArray(data.expenses)) {
                    setImportError('Invalid backup file: missing expenses array.');
                    return;
                }
                importData(data);
                setDailyLimit(data.settings?.dailyLimit || 500);
                setCurrency(data.settings?.currency || 'INR');
                setCategoryBudgets(data.settings?.categoryBudgets || {});
                setShowImportConfirm(false);
                setImportFile(null);
                setImportSuccess(true);
                setTimeout(() => setImportSuccess(false), 4000);
            } catch (err) {
                setImportError('Failed to parse backup file. Please ensure it is a valid JSON file.');
            }
        };
        reader.readAsText(importFile);
    };

    const cancelImport = () => {
        setShowImportConfirm(false);
        setImportFile(null);
        setImportError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="page-container" id="settings-page">
            <h1 className="page-title">
                <span className="gradient-text">Settings</span>
            </h1>
            <p className="page-subtitle">Configure your preferences</p>

            <div className="settings-grid">

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

                {/* Category Budgets (Change 9) */}
                <div className="settings-card glass-card">
                    <h3 className="section-title">Category Budgets (Monthly)</h3>
                    <p className="settings-desc">Set monthly spending limits for individual categories.</p>

                    <div className="budget-inputs-list">
                        {settings.categories.map((cat) => (
                            <div key={cat} className="budget-input-row">
                                <span className="budget-cat-label">{cat}</span>
                                <input
                                    type="number"
                                    className="input-field budget-input"
                                    placeholder="No limit"
                                    value={categoryBudgets[cat] || ''}
                                    onChange={(e) => handleBudgetChange(cat, e.target.value)}
                                    min="0"
                                    step="100"
                                />
                            </div>
                        ))}
                    </div>

                    <button className="btn-primary" onClick={handleSaveBudgets} id="save-budgets-btn">
                        <Save size={16} />
                        Save Budgets
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

                {/* Data Backup & Restore (Change 8) */}
                <div className="settings-card glass-card">
                    <h3 className="section-title">Data Backup & Restore</h3>
                    <p className="settings-desc">
                        Export your data as a JSON backup or restore from a previous backup file.
                    </p>

                    {importSuccess && (
                        <div className="save-success">
                            ✅ Data imported successfully!
                        </div>
                    )}

                    <div className="backup-actions">
                        <button className="btn-primary" onClick={handleExportJSON} id="export-json-btn">
                            <Download size={16} />
                            Export Data (JSON)
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => fileInputRef.current?.click()}
                            id="import-json-btn"
                        >
                            <Upload size={16} />
                            Import Data (JSON)
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".json"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Import Confirmation Dialog */}
                    {showImportConfirm && (
                        <div className="import-confirm">
                            <p className="confirm-text">
                                ⚠️ Importing will <strong>replace all existing data</strong>. Are you sure?
                            </p>
                            {importError && <p className="import-error">{importError}</p>}
                            <div className="confirm-buttons">
                                <button className="btn-secondary" onClick={cancelImport}>
                                    Cancel
                                </button>
                                <button className="btn-danger" onClick={handleImportJSON} id="confirm-import-btn">
                                    Yes, Import & Replace
                                </button>
                            </div>
                        </div>
                    )}
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
