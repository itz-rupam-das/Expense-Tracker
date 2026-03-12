import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Github, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import './Login.css';

export default function Login() {
    const { user, signInWithPassword, signUp, signInWithGoogle } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // If user is already authenticated, redirect to home
    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isLogin) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            if (!name.trim()) {
                setError('Please enter your name');
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            full_name: name.trim()
                        }
                    }
                });
                if (error) throw error;
                setSuccessMessage('Check your email for the confirmation link.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setSuccessMessage('');
        setLoading(true);

        // Safety timeout in case redirection doesn't happen or window is closed
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 8000);

        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
            // The page usually redirects, but if it doesn't, the timeout or success logic handles it
        } catch (err) {
            setError(err.message || 'An error occurred during Google authentication.');
            setLoading(false);
            clearTimeout(timeout);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-card">
                <div className="login-brand">
                    <div className="brand-logo">
                        <img src="/Expense-Tracker/logo.png" alt="Expense Tracker Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                    </div>
                    <h2>Expense Tracker</h2>
                </div>

                <div className="login-header">
                    <h1 className="gradient-text">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>Track your expenses seamlessly</p>
                </div>

                {error && <div className="login-error">{error}</div>}
                {successMessage && <div className="login-success">{successMessage}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="login-form-group">
                            <label className="input-label" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}
                    <div className="login-form-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {!isLogin && (
                        <div className="login-form-group">
                            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="input-field"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (
                            isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Sign Up</>
                        )}
                    </button>
                </form>

                <div className="login-divider">OR</div>

                <button
                    type="button"
                    className="btn-primary google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Continue with Google
                </button>

                <div className="login-footer">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        className="login-toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setSuccessMessage('');
                            setName('');
                            setConfirmPassword('');
                        }}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
