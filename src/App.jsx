import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Reports from './pages/Reports';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import './App.css';

function AppContent() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in inputs
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            if (e.key === 'n' || e.key === 'N') {
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
    }, [navigate]);

    return (
        <div className="app">
            <Navbar />
            <Notification />
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <ExpenseProvider>
                <AppContent />
            </ExpenseProvider>
        </ThemeProvider>
    );
}
