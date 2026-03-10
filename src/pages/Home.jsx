import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import SummaryCard from '../components/SummaryCard';
import { DollarSign, TrendingUp, Calendar, ShieldCheck, ArrowRight, Lightbulb, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const chartColors = [
    'rgba(139, 92, 246, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(168, 85, 247, 0.8)',
];

export default function Home() {
    const {
        isLoading,
        settings,
        formatCurrency,
        getTodayTotal,
        getWeeklyTotal,
        getMonthlyTotal,
        getRemainingLimit,
        getNetBalance,
        getRecentExpenses,
        getDailyData,
        getCategoryBreakdown,
        getCategoryMonthlySpending,
        getInsights,
    } = useExpenses();

    const todayTotal = getTodayTotal();
    const weeklyTotal = getWeeklyTotal();
    const monthlyTotal = getMonthlyTotal();
    const remaining = getRemainingLimit();
    const netBalance = getNetBalance();
    const recentExpenses = getRecentExpenses(5);
    const dailyData = getDailyData(7);
    const categoryBreakdown = getCategoryBreakdown();
    const categoryMonthly = getCategoryMonthlySpending();
    const insights = getInsights();

    const sym = settings.currencySymbol;

    // Compute remaining limit color and progress
    const limit = settings.dailyLimit;
    const spentToday = todayTotal;
    const progressPct = limit > 0 ? (spentToday / limit) * 100 : 0;

    let remainingColor;

    if (remaining >= limit) {
        remainingColor = '#34d399'; // green
    } else if (remaining >= limit * 0.6) {
        remainingColor = '#34d399'; // green
    } else if (remaining >= limit * 0.4) {
        remainingColor = '#fbbf24'; // yellow
    } else if (remaining >= limit * 0.2) {
        remainingColor = '#f97316'; // orange
    } else if (remaining >= 0) {
        remainingColor = '#f97316'; // orange-red
    } else {
        remainingColor = '#f87171'; // red
    }

    // Check if daily data has any spending
    const hasDailySpending = Object.values(dailyData).some((v) => v > 0);

    // Weekly bar chart
    const weeklyChartData = {
        labels: Object.keys(dailyData).map((d) => {
            const date = new Date(d + 'T00:00:00');
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }),
        datasets: [
            {
                label: 'Spending',
                data: Object.values(dailyData),
                backgroundColor: 'rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: (ctx) => formatCurrency(ctx.raw),
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 12 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 12 },
                    callback: (val) => `${sym}${val}`,
                },
            },
        },
    };

    // Category pie chart
    const categoryLabels = Object.keys(categoryBreakdown);
    const categoryValues = Object.values(categoryBreakdown);

    const pieData = {
        labels: categoryLabels,
        datasets: [
            {
                data: categoryValues,
                backgroundColor: chartColors.slice(0, categoryLabels.length),
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'rect', /* Square instead of circle */
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(139, 92, 246, 0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.raw)}`,
                },
            },
        },
    };

    // Category budget progress bars
    const budgets = settings.categoryBudgets || {};
    const budgetCategories = Object.entries(budgets).filter(([, b]) => b > 0);

    if (isLoading) {
        return (
            <div className="page-container loading-container">
                <div className="loader"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="page-container" id="home-page">
            <h1 className="page-title">
                <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="page-subtitle">Your financial overview at a glance</p>

            {/* Summary Cards */}
            <div className="summary-grid">
                <SummaryCard
                    icon={DollarSign}
                    label="Today's Spending"
                    value={formatCurrency(todayTotal)}
                    gradient="var(--gradient-primary)"
                    delay={0}
                />
                <SummaryCard
                    icon={TrendingUp}
                    label="This Week"
                    value={formatCurrency(weeklyTotal)}
                    gradient="var(--gradient-accent)"
                    delay={100}
                />
                <SummaryCard
                    icon={Calendar}
                    label="This Month"
                    value={formatCurrency(monthlyTotal)}
                    gradient="var(--gradient-info)"
                    delay={200}
                />
                <SummaryCard
                    icon={ShieldCheck}
                    label="Remaining Limit"
                    value={formatCurrency(remaining)}
                    gradient={remaining < 0 ? 'var(--gradient-danger)' : 'var(--gradient-success)'}
                    delay={300}
                    valueColor={remainingColor}
                    progress={progressPct}
                    progressColor={remainingColor}
                />
                <SummaryCard
                    icon={Scale}
                    label="Net Balance"
                    value={formatCurrency(netBalance)}
                    gradient={netBalance >= 0 ? 'var(--gradient-success)' : 'var(--gradient-danger)'}
                    delay={400}
                    valueColor={netBalance >= 0 ? '#34d399' : '#f87171'}
                />
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                <div className="chart-card glass-card">
                    <h3 className="section-title">Weekly Spending</h3>
                    <div className="chart-wrapper">
                        {hasDailySpending ? (
                            <Bar data={weeklyChartData} options={barOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No spending data this week</p>
                                <Link to="/wallet" className="btn-primary">
                                    Add Expense <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-card glass-card">
                    <h3 className="section-title">Category Breakdown</h3>
                    <div className="chart-wrapper pie-wrapper">
                        {categoryLabels.length > 0 ? (
                            <Doughnut data={pieData} options={pieOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No expenses yet</p>
                                <Link to="/wallet" className="btn-primary">
                                    Add Expense <ArrowRight size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Budget Progress (Change 9) */}
            {budgetCategories.length > 0 && (
                <div className="budget-section glass-card">
                    <h3 className="section-title">Category Budgets (This Month)</h3>
                    <div className="budget-list">
                        {budgetCategories.map(([cat, budget]) => {
                            const spent = categoryMonthly[cat] || 0;
                            const pct = Math.min((spent / budget) * 100, 100);
                            const isOver = spent > budget;
                            const isNear = spent >= budget * 0.8;
                            return (
                                <div key={cat} className="budget-item">
                                    <div className="budget-item-header">
                                        <span className="budget-cat-name">{cat}</span>
                                        <span className={`budget-amount ${isOver ? 'over' : isNear ? 'near' : ''}`}>
                                            {formatCurrency(spent)} / {formatCurrency(budget)}
                                        </span>
                                    </div>
                                    <div className="budget-bar-bg">
                                        <div
                                            className={`budget-bar-fill ${isOver ? 'over' : isNear ? 'near' : ''}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Spending Insights (Change 10) */}
            <div className="insights-section glass-card">
                <h3 className="section-title">
                    <Lightbulb size={20} /> Spending Insights
                </h3>
                <div className="insights-list">
                    {insights.map((insight, i) => (
                        <div key={i} className="insight-item">
                            {insight}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="recent-section glass-card">
                <div className="recent-header">
                    <h3 className="section-title">Recent Transactions</h3>
                    <Link to="/wallet" className="view-all-link">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                {recentExpenses.length > 0 ? (
                    <div className="recent-list">
                        {recentExpenses.map((expense, i) => (
                            <div
                                key={expense.id}
                                className="recent-item"
                                style={{ animationDelay: `${i * 80}ms` }}
                            >
                                <div className="recent-item-left">
                                    <div
                                        className="recent-category-dot"
                                        style={{
                                            background: (expense.type || 'expense') === 'income'
                                                ? '#34d399'
                                                : chartColors[
                                                settings.categories.indexOf(expense.category) % chartColors.length
                                                ],
                                        }}
                                    />
                                    <div>
                                        <span className="recent-item-category">
                                            {expense.category}
                                            {expense.type === 'income' && (
                                                <span className="income-badge">Income</span>
                                            )}
                                            {expense.recurring && (
                                                <span className="recurring-badge">🔄</span>
                                            )}
                                        </span>
                                        {expense.note && (
                                            <span className="recent-item-note">{expense.note}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="recent-item-right">
                                    <span
                                        className="recent-item-amount"
                                        style={{
                                            color: (expense.type || 'expense') === 'income' ? '#34d399' : undefined,
                                        }}
                                    >
                                        {(expense.type || 'expense') === 'income' ? '+' : '-'}
                                        {sym}{Number(expense.amount).toLocaleString()}
                                    </span>
                                    <span className="recent-item-date">
                                        {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No transactions yet. Start tracking your expenses!</p>
                        <Link to="/wallet" className="btn-primary">
                            Add Expense <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}
