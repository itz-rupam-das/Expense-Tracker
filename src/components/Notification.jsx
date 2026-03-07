import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import './Notification.css';

export default function Notification() {
    const { isLimitExceeded, getTodayTotal, settings } = useExpenses();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const todayTotal = getTodayTotal();
    const exceeded = todayTotal - settings.dailyLimit;

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
        <div className="notification-overlay" id="spending-alert" onClick={handleDismiss}>
            <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
                <div className="notification-popup-icon">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="notification-popup-title">⚠️ Spending Limit Exceeded!</h3>
                <p className="notification-popup-message">
                    You have exceeded your daily limit by{' '}
                    <span className="notification-exceed-amount">
                        {settings.currencySymbol}{exceeded.toLocaleString()}
                    </span>
                </p>
                <div className="notification-popup-details">
                    <div className="notification-detail-row">
                        <span>Today's Spending</span>
                        <span className="notification-detail-value danger">
                            {settings.currencySymbol}{todayTotal.toLocaleString()}
                        </span>
                    </div>
                    <div className="notification-detail-row">
                        <span>Daily Limit</span>
                        <span className="notification-detail-value">
                            {settings.currencySymbol}{settings.dailyLimit.toLocaleString()}
                        </span>
                    </div>
                </div>
                <button className="notification-gotit-btn" onClick={handleDismiss}>
                    Got It
                </button>
            </div>
        </div>
    );
}
