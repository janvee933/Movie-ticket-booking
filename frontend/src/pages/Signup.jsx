import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
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
                throw new Error(data.message || 'Signup failed');
            }

            // Signup successful - Auto login using context
            login(data.user, data.token);

            // Redirect back to intended destination or home
            const from = location.state?.from || '/home';
            navigate(from);
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
                        <button className="auth-tab active">Sign Up</button>
                        <Link to="/login" className="auth-tab">Sign In</Link>
                    </div>
                </div>

                {/* White Card Content */}
                <div className="login-content">
                    <h2 className="page-title">Create Account</h2>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && <div style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                        <div className="input-group-styled">
                            <User size={20} className="input-icon" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        <div className="input-group-styled">
                            <Lock size={20} className="input-icon" />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="divider">
                            <span>Or sign up with</span>
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
                        Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-primary fw-bold text-decoration-none">Sign In</Link>
                    </div>
                </div>

                {/* Bottom Curve Decoration */}
                <div className="login-footer-curve"></div>
            </div>
        </div>
    );
};

export default Signup;
