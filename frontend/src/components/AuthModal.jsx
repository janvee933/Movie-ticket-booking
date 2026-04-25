import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, X, Lock } from 'lucide-react';
import './AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, redirectPath } = useAuth();
    const navigate = useNavigate();

    if (!isAuthModalOpen) return null;

    const handleAction = (path) => {
        closeAuthModal();
        navigate(path, { state: { from: redirectPath } });
    };

    return (
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={closeAuthModal}>
                    <X size={20} />
                </button>

                <div className="auth-modal-header">
                    <div className="lock-icon-wrapper">
                        <Lock size={32} className="lock-icon" />
                    </div>
                    <h2 className="auth-modal-title">Authentication Required</h2>
                    <p className="auth-modal-subtitle">
                        Please sign in or create an account to continue with your booking.
                    </p>
                </div>

                <div className="auth-modal-options">
                    <button 
                        className="auth-option-btn primary"
                        onClick={() => handleAction('/login')}
                    >
                        <LogIn size={20} />
                        <span>Sign In</span>
                    </button>
                    
                    <button 
                        className="auth-option-btn secondary"
                        onClick={() => handleAction('/signup')}
                    >
                        <UserPlus size={20} />
                        <span>Create Account</span>
                    </button>
                </div>

                <div className="auth-modal-footer">
                    <p>Unlock premium features and manage your tickets easily.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
