import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, Clock, MapPin, Download, Home } from 'lucide-react';
import html2canvas from 'html2canvas';
import './BookingSuccess.css';

const BookingSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { // Note: Need to support get by ID in backend or user bookings
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // If backend doesn't support get single booking by ID for user, we might need to filter from all user bookings
                // For now assuming we add a route or filter

                // Fallback: Fetch all user bookings and find by ID if direct route fails (common in simple backends)
                if (res.status === 404 || !res.ok) {
                    const allRes = await fetch('http://localhost:5000/api/bookings', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const allData = await allRes.json();
                    const found = allData.find(b => b._id === id);
                    if (found) setBooking(found);
                } else {
                    const data = await res.json();
                    setBooking(data);
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleDownload = async () => {
        const element = document.getElementById('ticket-card');
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = `ticket-${id}.png`;
        link.click();
    };

    if (loading) return <div className="success-page"><div className="loader"></div></div>;
    if (!booking) return <div className="success-page"><p>Booking not found.</p></div>;

    const { showtime } = booking;
    const { movie, theater } = showtime || {};

    return (
        <div className="success-page">
            <div className="success-container">
                <div id="ticket-card" className="ticket-card">
                    <div className="ticket-header">
                        <div className="success-icon">
                            <Check size={32} />
                        </div>
                        <h1>Booking Confirmed!</h1>
                        <p>Your ticket has been booked successfully</p>
                    </div>

                    <div className="ticket-content">
                        <div className="movie-info">
                            {movie?.image && <img src={movie.image} alt={movie.title} className="ticket-poster" />}
                            <div className="movie-details">
                                <h2>{movie?.title}</h2>
                                <p>{movie?.genre}</p>
                                <p>{movie?.duration || '120'} mins • {movie?.language || 'English'}</p>
                            </div>
                        </div>

                        <div className="ticket-grid">
                            <div className="ticket-item">
                                <span className="ticket-label">Theater</span>
                                <span className="ticket-value">{theater?.name}</span>
                            </div>
                            <div className="ticket-item">
                                <span className="ticket-label">Screen</span>
                                <span className="ticket-value">Screen {showtime?.screen}</span>
                            </div>
                            <div className="ticket-item">
                                <span className="ticket-label">Date</span>
                                <span className="ticket-value">{new Date(showtime?.startTime).toLocaleDateString()}</span>
                            </div>
                            <div className="ticket-item">
                                <span className="ticket-label">Time</span>
                                <span className="ticket-value">{new Date(showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="ticket-item" style={{ gridColumn: 'span 2' }}>
                                <span className="ticket-label">Seats</span>
                                <span className="ticket-value seats-value">{booking.seats.join(', ')}</span>
                            </div>
                            <div className="ticket-item">
                                <span className="ticket-label">Booking ID</span>
                                <span className="ticket-value mono" style={{ fontSize: '0.9rem' }}>{booking._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="ticket-item">
                                <span className="ticket-label">Amount Paid</span>
                                <span className="ticket-value">₹{booking.totalAmount}</span>
                            </div>
                        </div>

                        <div className="ticket-footer hide-on-download">
                            <button className="btn btn-outline" onClick={() => navigate('/home')}>
                                <Home size={18} style={{ marginRight: '0.5rem' }} /> Home
                            </button>
                            {/* Download feature requires html2canvas installed, avoiding import error if not present. 
                                For now, simpler button. */}
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                <Download size={18} style={{ marginRight: '0.5rem' }} /> Print / Save
                            </button>
                        </div>

                        <div className="barcode"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
