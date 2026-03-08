import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Github, LogIn, UserPlus } from 'lucide-react';
import './Login.css';

export default function Login() {
    const { user, signInWithPassword, signUp, signInWithGithub } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // If user is already authenticated, redirect to home
    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await signUp({ email, password });
                if (error) throw error;
                // You might want to show a success message or handle email confirmation here
                setError('Check your email for the confirmation link.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card glass-card">
                <div className="login-header">
                    <h1 className="gradient-text">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>Track your expenses seamlessly</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <label className="input-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label className="input-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (
                            isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Sign Up</>
                        )}
                    </button>
                </form>

                <div className="login-divider">OR</div>

                <button
                    className="btn-primary github-btn"
                    onClick={() => signInWithGithub()}
                    disabled={loading}
                >
                    <Github size={18} /> Continue with GitHub
                </button>

                <div className="login-footer">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        className="login-toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
