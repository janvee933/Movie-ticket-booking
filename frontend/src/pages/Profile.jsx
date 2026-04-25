import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Edit2, Save, X, Calendar, MapPin, Clock, Camera, Ticket, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, token, login, logout } = useAuth();
    
    // Strictly separate: Profile only shows for regular user session
    const currentUser = user;
    const currentToken = token;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profileImage: ''
    });
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        if (currentUser && currentToken) {
            setFormData({
                name: currentUser.name,
                email: currentUser.email,
                profileImage: currentUser.profileImage || ''
            });

            // Fetch Bookings
            const fetchBookings = async () => {
                try {
                    const res = await fetch('/api/bookings', {
                        headers: {
                            'Authorization': `Bearer ${currentToken}`
                        }
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setBookings(data);
                    }
                } catch (error) {
                    console.error("Error fetching bookings", error);
                } finally {
                    setLoadingBookings(false);
                }
            };
            fetchBookings();

        } else {
            navigate('/login');
        }
    }, [currentUser, currentToken, navigate]);

    const handleLogout = () => {
        logout('user');
        navigate('/login');
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (formData.profileImage) {
                data.append('profileImage', formData.profileImage);
            }

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                const updatedUser = { ...currentUser, ...result.user };
                login(updatedUser, currentToken);
                setIsEditing(false);
            } else {
                alert(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profileImage: e.target.files[0] });
    };

    if (!currentUser) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile-banner"></div>

            <div className="profile-container">
                <div className="profile-card-wrapper">
                    {/* Sidebar / User Info */}
                    <div className="profile-sidebar">
                        <div className="avatar-section">
                            <div className="profile-avatar">
                                {currentUser.profileImage ? (
                                    <img src={currentUser.profileImage} alt="Profile" className="avatar-image" />
                                ) : (
                                    <div className="avatar-placeholder">{currentUser.name.charAt(0)}</div>
                                )}
                                <label className="avatar-edit-btn" title="Change Profile Picture">
                                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                                    <Camera size={18} />
                                </label>
                            </div>
                            <h2 className="user-name">{currentUser.name}</h2>
                            <p className="user-email">{currentUser.email}</p>
                        </div>

                        <div className="sidebar-actions">
                            {!isEditing ? (
                                <>
                                    <button className="btn-action edit" onClick={() => setIsEditing(true)}>
                                        <Edit2 size={18} /> Edit Profile
                                    </button>
                                    <button className="btn-action logout" onClick={handleLogout}>
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="edit-controls">
                                    <button className="btn-action save" onClick={handleSave}>
                                        <Save size={18} /> Save
                                    </button>
                                    <button className="btn-action cancel" onClick={() => setIsEditing(false)}>
                                        <X size={18} /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="profile-content">
                        {isEditing ? (
                            <div className="edit-form-section">
                                <h3>Edit Personal Details</h3>
                                <form className="edit-form">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-with-icon">
                                            <User size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="bookings-section">
                                <div className="section-header">
                                    <h3><Ticket size={24} style={{ color: 'var(--color-primary)' }} /> My Recent Bookings</h3>
                                </div>

                                {loadingBookings ? (
                                    <div className="loading-state">Loading your tickets...</div>
                                ) : bookings.length > 0 ? (
                                    <div className="bookings-grid">
                                        {bookings.map((booking) => (
                                            <div key={booking._id} className="ticket-card">
                                                <div className="ticket-header">
                                                    <span className="movie-title">{booking.showtime?.movie?.title || 'Unknown Movie'}</span>
                                                    <span className={`status-pill ${booking.status}`}>{booking.status}</span>
                                                </div>
                                                <div className="ticket-body">
                                                    <div className="ticket-info">
                                                        <div className="info-row">
                                                            <User size={16} /> <span><strong>{booking.customerName}</strong></span>
                                                        </div>
                                                        <div className="info-row">
                                                            <MapPin size={16} /> <span>{booking.showtime?.theater?.name}</span>
                                                        </div>
                                                        <div className="info-row">
                                                            <Calendar size={16} />
                                                            <span>{booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleDateString() : 'N/A'}</span>
                                                        </div>
                                                        <div className="info-row">
                                                            <Clock size={16} />
                                                            <span>{booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="ticket-seats">
                                                        <label>Seats</label>
                                                        <div className="seats-list">
                                                            {booking.seats?.join(', ')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="ticket-footer">
                                                    <div className="total-amount">
                                                        <span>Total Paid</span>
                                                        <strong>₹{booking.totalAmount}</strong>
                                                    </div>
                                                    <button className="btn-download" title="Download Ticket">
                                                        Download
                                                    </button>
                                                </div>
                                                {/* Decorative jagged edge */}
                                                <div className="ticket-edge-left"></div>
                                                <div className="ticket-edge-right"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <Ticket size={48} className="empty-icon" />
                                        <p>You haven't booked any movies yet.</p>
                                        <button className="btn-browse" onClick={() => navigate('/movies')}>Browse Movies</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
