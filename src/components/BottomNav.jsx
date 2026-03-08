import { NavLink } from 'react-router-dom';
import { Home, Wallet, Plus, BarChart3, Mail } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-inner">
                <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                    <Home size={22} />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/reports" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart3 size={22} />
                    <span>Reports</span>
                </NavLink>

                <div className="bottom-nav-item center-btn-wrapper">
                    <NavLink to="/wallet" state={{ openForm: true }} className="center-add-btn" aria-label="Add transaction">
                        <Plus size={28} />
                    </NavLink>
                </div>

                <NavLink to="/wallet" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                    <Wallet size={22} />
                    <span>Wallet</span>
                </NavLink>

                <NavLink to="/contact" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <Mail size={22} />
                    <span>Contact</span>
                </NavLink>
            </div>
        </nav>
    );
}
