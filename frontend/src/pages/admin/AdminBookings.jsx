import React, { useState, useEffect } from 'react';
import { Check, X, Search, Calendar, User, Film, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminBookings = () => {
    const { adminToken, superAdminToken } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = adminToken || superAdminToken || localStorage.getItem('admin_token') || localStorage.getItem('superadmin_token');
        try {
            const res = await fetch('/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const filteredBookings = Array.isArray(bookings) ? bookings.filter(b => 
        b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        b.showtime?.movie?.title?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    if (loading) return <div className="admin-page-container">Loading bookings...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">Manage Bookings</h1>
            </div>

            <div className="admin-toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search bookings by movie or user..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Movie & Theater</th>
                            <th>Seats</th>
                            <th>Total Amount</th>
                            <th>Payment & Contact</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="user-avatar-mini">{booking.customerName?.charAt(0) || 'U'}</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'white' }}>{booking.customerName || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Booked by: {booking.user?.name || 'Unknown'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 text-white font-medium">
                                        <Film size={14} className="text-primary" /> {booking.showtime?.movie?.title}
                                    </div>
                                    <div className="d-flex align-items-center gap-2 text-muted small mt-1">
                                        <MapPin size={12} /> {booking.showtime?.theater?.name} - {booking.showtime?.screen}
                                    </div>
                                </td>
                                <td className="text-white fw-bold">{booking.seats.join(', ')}</td>
                                <td className="text-success fw-bold">₹{booking.totalAmount}</td>
                                <td>
                                    <div className="text-white small fw-medium">{booking.paymentMethod?.toUpperCase() || '-'}</div>
                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{booking.phoneNumber || 'N/A'}</div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 text-muted small">
                                        <Calendar size={12} /> {new Date(booking.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${booking.status === 'confirmed' ? 'success' : 'danger'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <div className="p-5 text-center text-muted">
                        No bookings found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookings;
