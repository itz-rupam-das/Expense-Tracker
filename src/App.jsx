import { Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Reports from './pages/Reports';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
    return (
        <ExpenseProvider>
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
        </ExpenseProvider>
    );
}
