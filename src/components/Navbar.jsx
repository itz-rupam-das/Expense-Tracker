import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wallet, BarChart3, Mail, Settings, Menu, X, TrendingDown } from 'lucide-react';
import './Navbar.css';

const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/contact', label: 'Contact', icon: Mail },
    { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
    const closeMobile = () => setIsMobileOpen(false);

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-logo" onClick={closeMobile}>
                    <div className="logo-icon">
                        <TrendingDown size={22} />
                    </div>
                    <span className="logo-text">Expense<span className="logo-accent">Tracker</span></span>
                </NavLink>

                <div className={`navbar-links ${isMobileOpen ? 'open' : ''}`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={closeMobile}
                            end={item.path === '/'}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <button
                    className="navbar-toggle"
                    onClick={toggleMobile}
                    aria-label="Toggle navigation"
                    id="navbar-toggle-btn"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileOpen && <div className="navbar-overlay" onClick={closeMobile} />}
        </nav>
    );
}
