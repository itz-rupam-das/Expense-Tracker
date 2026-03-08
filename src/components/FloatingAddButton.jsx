import { Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './FloatingAddButton.css';

export default function FloatingAddButton() {
    const location = useLocation();

    // Don't show the button if we are already on the wallet page
    // and the new transaction form could be open
    if (location.pathname === '/wallet') {
        return null;
    }

    return (
        <Link to="/wallet" state={{ openForm: true }} className="floating-add-btn" aria-label="Add transaction">
            <Plus size={24} />
        </Link>
    );
}
