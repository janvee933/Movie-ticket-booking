import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Shield } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // If no user found, redirect to login
            // eslint-disable-next-line react-hooks/set-state-in-effect
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={64} />
                    </div>
                    <h1>My Account</h1>
                    <p className="profile-subtitle">Manage your personal information</p>
                </div>

                <div className="profile-card">
                    <div className="profile-info-group">
                        <div className="info-item">
                            <span className="info-label"><User size={18} /> Name</span>
                            <span className="info-value">{user.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label"><Mail size={18} /> Email</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label"><Shield size={18} /> User ID</span>
                            <span className="info-value mono">{user.id || user._id}</span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn btn-logout" onClick={handleLogout}>
                            <LogOut size={20} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
