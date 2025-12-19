import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Shield, Edit2, Save, X, Calendar, MapPin, Clock } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profileImage: ''
    });
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name,
                email: parsedUser.email,
                profileImage: parsedUser.profileImage || ''
            });

            // Fetch Bookings
            const fetchBookings = async () => {
                try {
                    const res = await fetch('/api/bookings', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
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
            // If no user or token found, redirect to login
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type header is excluded; browser sets it automatically with boundary for FormData
                },
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                const updatedUser = { ...user, ...result.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert('Profile updated successfully!');
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

    if (!user) {
        return <div className="profile-container">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div
                        className="profile-avatar"
                        onClick={() => setIsEditing(true)}
                        style={{ cursor: 'pointer', position: 'relative' }}
                        title="Click to change profile picture"
                    >
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="avatar-image" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <User size={64} />
                        )}
                        <div className="avatar-overlay">
                            <Edit2 size={24} color="white" />
                        </div>
                    </div>
                    <h1>My Account</h1>
                    <p className="profile-subtitle">Manage your personal information</p>
                </div>

                <div className="profile-card">
                    {isEditing ? (
                        <form onSubmit={handleSave} className="profile-edit-form">
                            <div className="profile-info-group">
                                <div className="info-item">
                                    <span className="info-label">Profile Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="profile-input"
                                    />
                                </div>
                                <div className="info-item">
                                    <span className="info-label"><User size={18} /> Name</span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="profile-input"
                                        required
                                    />
                                </div>
                                <div className="info-item">
                                    <span className="info-label"><Mail size={18} /> Email</span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="profile-input"
                                        required
                                    />
                                </div>

                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} style={{ marginRight: '0.5rem' }} /> Save Changes
                                </button>
                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                                    <X size={18} style={{ marginRight: '0.5rem' }} /> Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="profile-info-group">
                                <div className="info-item">
                                    <span className="info-label"><User size={18} /> Name</span>
                                    <span className="info-value">{user.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label"><Mail size={18} /> Email</span>
                                    <span className="info-value">{user.email}</span>
                                </div>

                            </div>

                            <div className="profile-actions">
                                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                    <Edit2 size={18} style={{ marginRight: '0.5rem' }} /> Edit Profile
                                </button>
                                <button className="btn btn-logout" onClick={handleLogout}>
                                    <LogOut size={20} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Booking History Section */}
                {!isEditing && (
                    <div className="bookings-section">
                        <h2>My Bookings</h2>
                        {loadingBookings ? (
                            <p>Loading bookings...</p>
                        ) : bookings.length > 0 ? (
                            <div className="bookings-list">
                                {bookings.map((booking) => (
                                    <div key={booking._id} className="booking-card">
                                        <div className="booking-header">
                                            <h3>{booking.showtime?.movie?.title || 'Unknown Movie'}</h3>
                                            <span className={`status-badge ${booking.status || 'pending'}`}>{booking.status || 'Pending'}</span>
                                        </div>
                                        <div className="booking-details">
                                            <div className="detail-row">
                                                <MapPin size={16} />
                                                <span>{booking.showtime?.theater?.name || 'Unknown Theater'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <Calendar size={16} />
                                                <span>{booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleDateString() : 'Date N/A'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <Clock size={16} />
                                                <span>{booking.showtime?.startTime ? new Date(booking.showtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time N/A'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="label">Seats:</span>
                                                <span className="value">{booking.seats?.length > 0 ? booking.seats.join(', ') : 'None'}</span>
                                            </div>
                                            <div className="detail-row total">
                                                <span className="label">Total:</span>
                                                <span className="value">₹{booking.totalAmount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-bookings">
                                <p>You haven't booked any tickets yet.</p>
                                <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Movies</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
};

export default Profile;
