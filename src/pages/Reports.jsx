import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { BarChart3, TrendingUp, Calendar, PieChart, Download, Lightbulb, Scale } from 'lucide-react';
import './Reports.css';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, Tooltip, Legend, Filler
);

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

function getLocalDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export default function Reports() {
    const {
        isLoading,
        expenses,
        settings,
        formatCurrency,
        getDailyData,
        getWeeklyData,
        getMonthlyData,
        getCategoryBreakdown,
        getCategoryMonthlySpending,
        getIncomeVsExpenseMonthly,
        getInsights,
    } = useExpenses();
    const sym = settings.currencySymbol;

    const dailyData = getDailyData(7);
    const weeklyData = getWeeklyData(4);
    const monthlyData = getMonthlyData(6);
    const categoryBreakdown = getCategoryBreakdown();
    const incomeVsExpense = getIncomeVsExpenseMonthly(6);
    const insights = getInsights();

    const hasDailyData = Object.values(dailyData).some((v) => v > 0);
    const hasWeeklyData = Object.values(weeklyData).some((v) => v > 0);
    const hasMonthlyData = Object.values(monthlyData).some((v) => v > 0);
    const hasIncomeOrExpense = incomeVsExpense.incomeData.some((v) => v > 0) || incomeVsExpense.expenseData.some((v) => v > 0);

    const commonTooltip = {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
    };

    // Daily Line Chart
    const dailyChartData = {
        labels: Object.keys(dailyData).map((d) => {
            const date = new Date(d + 'T00:00:00');
            return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Daily Spending',
                data: Object.values(dailyData),
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (val) => `${sym}${val}`,
                },
            },
        },
    };

    // Weekly Bar Chart — Horizontal
    const weeklyChartData = {
        labels: Object.keys(weeklyData),
        datasets: [
            {
                label: 'Weekly Spending',
                data: Object.values(weeklyData),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(192, 132, 252, 0.7)',
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(192, 132, 252, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const weeklyBarOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (val) => `${sym}${val}`,
                },
            },
            y: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 } },
            },
        },
    };

    // Monthly Bar Chart
    const monthlyChartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Monthly Spending',
                data: Object.values(monthlyData),
                backgroundColor: Object.keys(monthlyData).map((_, i) => {
                    const colors = [
                        'rgba(6, 182, 212, 0.6)',
                        'rgba(20, 184, 166, 0.6)',
                        'rgba(16, 185, 129, 0.6)',
                        'rgba(52, 211, 153, 0.6)',
                        'rgba(110, 231, 183, 0.6)',
                        'rgba(167, 243, 208, 0.6)',
                    ];
                    return colors[i % colors.length];
                }),
                borderColor: Object.keys(monthlyData).map((_, i) => {
                    const colors = [
                        'rgba(6, 182, 212, 1)',
                        'rgba(20, 184, 166, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(52, 211, 153, 1)',
                        'rgba(110, 231, 183, 1)',
                        'rgba(167, 243, 208, 1)',
                    ];
                    return colors[i % colors.length];
                }),
                borderWidth: 2,
                borderRadius: { topLeft: 12, topRight: 12 },
                borderSkipped: 'bottom',
                barPercentage: 0.6,
            },
        ],
    };

    const monthlyBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (val) => `${sym}${val}`,
                },
            },
        },
    };

    // Category Pie Chart
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
                ...commonTooltip,
                callbacks: { label: (ctx) => ` ${ctx.label}: ${formatCurrency(ctx.raw)}` },
            },
        },
    };

    // Income vs Expense Chart (Change 5)
    const incomeVsExpenseChart = {
        labels: incomeVsExpense.labels,
        datasets: [
            {
                label: 'Income',
                data: incomeVsExpense.incomeData,
                backgroundColor: 'rgba(52, 211, 153, 0.6)',
                borderColor: 'rgba(52, 211, 153, 1)',
                borderWidth: 2,
                borderRadius: 6,
            },
            {
                label: 'Expenses',
                data: incomeVsExpense.expenseData,
                backgroundColor: 'rgba(248, 113, 113, 0.6)',
                borderColor: 'rgba(248, 113, 113, 1)',
                borderWidth: 2,
                borderRadius: 6,
            },
        ],
    };

    const incomeVsExpenseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (val) => `${sym}${val}`,
                },
            },
        },
    };

    // Budget vs Actual Chart (Change 11)
    const budgets = settings.categoryBudgets || {};
    const monthlySpending = getCategoryMonthlySpending();
    const budgetCategories = Object.entries(budgets).filter(([, b]) => b > 0);
    const hasBudgets = budgetCategories.length > 0;

    const budgetVsActualChart = hasBudgets ? {
        labels: budgetCategories.map(([cat]) => cat),
        datasets: [
            {
                label: 'Budget',
                data: budgetCategories.map(([, b]) => b),
                backgroundColor: 'rgba(20, 184, 166, 0.6)',
                borderColor: 'rgba(20, 184, 166, 1)',
                borderWidth: 2,
                borderRadius: 6,
            },
            {
                label: 'Actual',
                data: budgetCategories.map(([cat]) => monthlySpending[cat] || 0),
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2,
                borderRadius: 6,
            },
        ],
    } : null;

    const budgetVsActualOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (val) => `${sym}${val}`,
                },
            },
        },
    };

    // CSV export
    const exportCSV = () => {
        const expensesOnly = expenses.filter((e) => (e.type || 'expense') === 'expense');
        const headers = ['Date', 'Category', 'Amount', 'Type', 'Notes'];
        const rows = expensesOnly.map((e) => [
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
        link.download = `report_${getLocalDate()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="page-container loading-container">
                <div className="loader"></div>
                <p>Loading your reports...</p>
            </div>
        );
    }

    return (
        <div className="page-container" id="reports-page">
            <div className="reports-header">
                <div>
                    <h1 className="page-title">
                        <span className="gradient-text">Reports</span>
                    </h1>
                    <p className="page-subtitle">Detailed spending analytics and trends</p>
                </div>
                <button className="btn-secondary export-csv-btn" onClick={exportCSV} id="reports-export-csv">
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {/* Insights (Change 10) */}
            <div className="insights-card glass-card">
                <h3 className="section-title">
                    <Lightbulb size={20} /> Spending Insights
                </h3>
                <div className="insights-list">
                    {insights.map((insight, i) => (
                        <div key={i} className="insight-item">{insight}</div>
                    ))}
                </div>
            </div>

            <div className="reports-grid">
                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <TrendingUp size={20} /> Daily Spending (Last 7 Days)
                    </h3>
                    <div className="report-chart-wrapper">
                        {hasDailyData ? (
                            <Line data={dailyChartData} options={lineOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No daily spending data yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <BarChart3 size={20} /> Weekly Spending (Last 4 Weeks)
                    </h3>
                    <div className="report-chart-wrapper">
                        {hasWeeklyData ? (
                            <Bar data={weeklyChartData} options={weeklyBarOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No weekly spending data yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <Calendar size={20} /> Monthly Spending (Last 6 Months)
                    </h3>
                    <div className="report-chart-wrapper">
                        {hasMonthlyData ? (
                            <Bar data={monthlyChartData} options={monthlyBarOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No monthly spending data yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <PieChart size={20} /> Category Breakdown
                    </h3>
                    <div className="report-chart-wrapper pie-chart-wrapper">
                        {categoryLabels.length > 0 ? (
                            <Doughnut data={pieData} options={pieOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No data available yet. Add expenses to see category breakdown.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Income vs Expense Chart (Change 5) */}
                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <Scale size={20} /> Income vs Expenses (Last 6 Months)
                    </h3>
                    <div className="report-chart-wrapper">
                        {hasIncomeOrExpense ? (
                            <Bar data={incomeVsExpenseChart} options={incomeVsExpenseOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>Add income and expenses to see comparison.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Budget vs Actual Chart (Change 11) */}
                {hasBudgets && (
                    <div className="report-card glass-card">
                        <h3 className="section-title">
                            <BarChart3 size={20} /> Budget vs Actual (This Month)
                        </h3>
                        <div className="report-chart-wrapper">
                            <Bar data={budgetVsActualChart} options={budgetVsActualOptions} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
