import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import './Notification.css';

export default function Notification() {
    const { isLimitExceeded, getTodayTotal, settings } = useExpenses();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (isLimitExceeded() && !dismissed) {
            setVisible(true);
        } else if (!isLimitExceeded()) {
            setDismissed(false);
            setVisible(false);
        }
    }, [isLimitExceeded, dismissed]);

    const handleDismiss = () => {
        setDismissed(true);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="notification-toast" id="spending-alert">
            <div className="notification-icon">
                <AlertTriangle size={20} />
            </div>
            <div className="notification-content">
                <strong>⚠ Daily Spending Limit Reached</strong>
                <p>
                    You have spent {settings.currencySymbol}{getTodayTotal().toLocaleString()} today.
                    Your limit was {settings.currencySymbol}{settings.dailyLimit.toLocaleString()}.
                </p>
            </div>
            <button className="notification-close" onClick={handleDismiss} aria-label="Dismiss alert">
                <X size={16} />
            </button>
        </div>
    );
}
