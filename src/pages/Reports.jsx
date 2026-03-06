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
import { Bar, Line, Pie } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { BarChart3 } from 'lucide-react';
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

export default function Reports() {
    const { settings, getDailyData, getWeeklyData, getMonthlyData, getCategoryBreakdown } = useExpenses();
    const sym = settings.currencySymbol;

    const dailyData = getDailyData(7);
    const weeklyData = getWeeklyData(4);
    const monthlyData = getMonthlyData(6);
    const categoryBreakdown = getCategoryBreakdown();

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
            const date = new Date(d);
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
                callbacks: { label: (ctx) => `${sym}${ctx.raw.toLocaleString()}` },
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

    // Weekly Bar Chart
    const weeklyChartData = {
        labels: Object.keys(weeklyData),
        datasets: [
            {
                label: 'Weekly Spending',
                data: Object.values(weeklyData),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
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
                ...commonTooltip,
                callbacks: { label: (ctx) => `${sym}${ctx.raw.toLocaleString()}` },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 } },
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

    // Monthly Bar Chart
    const monthlyChartData = {
        labels: Object.keys(monthlyData),
        datasets: [
            {
                label: 'Monthly Spending',
                data: Object.values(monthlyData),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
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
                borderColor: 'rgba(10, 14, 26, 0.8)',
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: { size: 12 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                },
            },
            tooltip: {
                ...commonTooltip,
                callbacks: { label: (ctx) => ` ${ctx.label}: ${sym}${ctx.raw.toLocaleString()}` },
            },
        },
    };

    return (
        <div className="page-container" id="reports-page">
            <h1 className="page-title">
                <span className="gradient-text">Reports</span>
            </h1>
            <p className="page-subtitle">Detailed spending analytics and trends</p>

            <div className="reports-grid">
                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <BarChart3 size={20} /> Daily Spending (Last 7 Days)
                    </h3>
                    <div className="report-chart-wrapper">
                        <Line data={dailyChartData} options={lineOptions} />
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <BarChart3 size={20} /> Weekly Spending (Last 4 Weeks)
                    </h3>
                    <div className="report-chart-wrapper">
                        <Bar data={weeklyChartData} options={barOptions} />
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <BarChart3 size={20} /> Monthly Spending (Last 6 Months)
                    </h3>
                    <div className="report-chart-wrapper">
                        <Bar data={monthlyChartData} options={barOptions} />
                    </div>
                </div>

                <div className="report-card glass-card">
                    <h3 className="section-title">
                        <BarChart3 size={20} /> Category Breakdown
                    </h3>
                    <div className="report-chart-wrapper pie-chart-wrapper">
                        {categoryLabels.length > 0 ? (
                            <Pie data={pieData} options={pieOptions} />
                        ) : (
                            <div className="empty-chart">
                                <p>No data available yet. Add expenses to see category breakdown.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
