import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#1a1c23' }}>Bookings</h1>
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Movie</th>
                            <th>Theater</th>
                            <th>Seats</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>
                                    <div>{booking.user?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.user?.email}</div>
                                </td>
                                <td>{booking.showtime?.movie?.title}</td>
                                <td>{booking.showtime?.theater?.name}</td>
                                <td>{booking.seats.join(', ')}</td>
                                <td>₹{booking.totalAmount}</td>
                                <td>{new Date(booking.createdAt).toLocaleString()}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                                        color: booking.status === 'confirmed' ? '#166534' : '#991b1b',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {booking.status === 'confirmed' ? <Check size={12} /> : <X size={12} />}
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBookings;
