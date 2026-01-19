import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store user info in localStorage (simple auth persistence)
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            if (data.user.role === 'admin') {
                // Force a reload to ensure all admin states/routes are correctly loaded
                window.location.href = '/admin';
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <Link to="/" className="logo">
                        <Film className="logo-icon" />
                        <span className="logo-text">Cine<span className="highlight">Ticket</span></span>
                    </Link>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account to continue</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                </form>

                <div className="quick-login">
                    <p className="quick-login-text">Quick Login (For Testing)</p>
                    <div className="quick-login-buttons">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEmail('janvee84@gmail.com');
                                setPassword('123456');
                            }}
                        >
                            Demo User
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setEmail('admin@example.com');
                                setPassword('admin123');
                            }}
                        >
                            Admin User
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup" className="highlight">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
