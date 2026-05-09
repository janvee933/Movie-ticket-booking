import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error("Server returned non-JSON response:", text);
                throw new Error(`Server error: Received non-JSON response. (Content: ${text.substring(0, 100)}...)`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Use context to login
            login(data.user, data.token);

            // Check if there's a destination to redirect back to
            const from = location.state?.from || '/home';

            if (data.user.role === 'superadmin') {
                window.location.href = '/superadmin';
            } else if (data.user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                navigate(from);
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
                {/* Curved Header Background */}
                <div className="login-header-bg">
                    <button onClick={() => navigate('/')} className="back-btn">
                        <ArrowLeft size={24} />
                    </button>

                    {/* Tabs positioned over the header */}
                    <div className="auth-tabs">
                        <Link to="/signup" className="auth-tab">Sign Up</Link>
                        <button className="auth-tab active">Sign In</button>
                    </div>
                </div>

                {/* White Card Content */}
                <div className="login-content">
                    <h2 className="page-title">Welcome Back !</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                        <div className="input-group-styled">
                            <Mail size={20} className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group-styled">
                            <Lock size={20} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="form-options">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember Password
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forget Password?</Link>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div className="divider">
                            <span>Or sign in with</span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="social-btn google">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="google-icon" style={{ width: '20px' }} />
                                Google
                            </button>
                            <button type="button" className="social-btn facebook">
                                <Facebook size={20} fill="white" />
                                Facebook
                            </button>
                        </div>
                    </form>

                    <div className="auth-footer-text mt-4">
                        Don't have an account? <Link to="/signup" state={{ from: location.state?.from }} className="text-primary fw-bold text-decoration-none">Sign Up</Link>
                    </div>
                </div>

                {/* Bottom Curve Decoration */}
                <div className="login-footer-curve"></div>
            </div>
        </div>
    );
};

export default Login;
