import { NavLink } from 'react-router-dom';
import { Code, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-logo">
                    <div className="logo-icon">
                        <img src="/Expense-Tracker/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                    </div>
                    <span className="logo-text">Expense<span className="logo-accent">Tracker</span></span>
                </NavLink>

                <div className="navbar-actions">
                    <button onClick={toggleTheme} className="nav-action-btn theme-nav-btn" aria-label="Toggle theme">
                        {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
                    </button>
                    <NavLink to="/settings" className="nav-action-btn" aria-label="Settings">
                        <Settings size={22} />
                    </NavLink>
                    <NavLink to="/developer" className="nav-dev-chip" aria-label="Developer Profile">
                        <Code size={18} />
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
