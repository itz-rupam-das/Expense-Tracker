import './SummaryCard.css';

export default function SummaryCard({ icon: Icon, label, value, trend, trendUp, gradient, delay = 0, valueColor, emoji, progress, progressColor }) {
    return (
        <div
            className="summary-card glass-card"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="summary-card-icon" style={{ background: gradient }}>
                {Icon && <Icon size={22} />}
            </div>
            <div className="summary-card-content">
                <span className="summary-card-label">{label}</span>
                <div className="summary-card-value-row">
                    <span
                        className="summary-card-value"
                        style={valueColor ? { color: valueColor } : undefined}
                    >
                        {value}
                    </span>
                    {emoji && <span className="summary-card-emoji">{emoji}</span>}
                </div>
                {trend !== undefined && (
                    <span className={`summary-card-trend ${trendUp ? 'up' : 'down'}`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
                {progress !== undefined && (
                    <div className="summary-card-progress-bg">
                        <div
                            className="summary-card-progress-fill"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: progressColor }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
