import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Notification from './components/Notification';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Developer from './pages/Developer';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './App.css';

function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-state">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppContent() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in inputs
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            if (user && (e.key === 'n' || e.key === 'N')) {
                e.preventDefault();
                navigate('/wallet');
                // Small delay to let the page render before triggering the add button
                setTimeout(() => {
                    const addBtn = document.getElementById('add-expense-btn');
                    if (addBtn) addBtn.click();
                }, 100);
            }

            if (e.key === 'Escape') {
                // Close any open overlay/modal
                const overlay = document.querySelector('.form-overlay');
                if (overlay) overlay.click();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, user]);

    return (
        <div className="app">
            {user && <Navbar />}
            {user && <Notification />}
            <main className={`app-main ${!user ? 'login-layout' : ''} ${user ? 'with-bottom-nav' : ''}`}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/developer" element={<ProtectedRoute><Developer /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
            </main>
            {user && <BottomNav />}
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <ExpenseProvider>
                    <AppContent />
                </ExpenseProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
