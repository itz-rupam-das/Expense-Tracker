import { NavLink } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { signOut } = useAuth();

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
                    <NavLink to="/settings" className="nav-action-btn" aria-label="Settings">
                        <Settings size={22} />
                    </NavLink>
                    <button onClick={signOut} className="nav-action-btn logout-action-btn" aria-label="Logout">
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
