import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Calendar, Clock, MapPin, Download, Home, Film } from 'lucide-react';
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
                <div id="ticket-card" className="ticket-wrapper">
                    <div className="ticket-main">
                        {/* Branding Header */}
                        <div style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#000' }}>
                            <div style={{ background: '#e50914', padding: '4px', borderRadius: '4px', display: 'flex' }}><Film size={16} color="white" /></div>
                            <span style={{ fontWeight: '800', fontSize: '1rem', color: '#e50914', letterSpacing: '0.5px' }}>Cine<span style={{ color: '#fff' }}>Ticket</span></span>
                        </div>

                        <div className="ticket-header">
                            {movie?.image && <img src={movie.image} alt={movie.title} className="ticket-movie-poster" />}
                            <h2 className="ticket-movie-title">{movie?.title}</h2>
                            <p className="ticket-movie-genre">{movie?.genre} • {movie?.language || 'English'}</p>
                        </div>

                        <div className="ticket-divider"></div>

                        <div className="ticket-body">
                            {/* User Details */}
                            <div className="ticket-row" style={{ background: '#111', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #333' }}>
                                <div>
                                    <div className="ticket-label">Booked By</div>
                                    <div className="ticket-value" style={{ fontSize: '0.9rem', color: '#fff' }}>{booking.user?.name || 'Guest User'}</div>
                                    <small style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{booking.user?.email}</small>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="ticket-label">Status</div>
                                    <div className="ticket-value" style={{ color: '#4ade80', fontSize: '0.9rem' }}>Confirmed</div>
                                </div>
                            </div>

                            <div className="ticket-row">
                                <div>
                                    <div className="ticket-label">Theater</div>
                                    <div className="ticket-value">{theater?.name}</div>
                                    <small style={{ color: '#666' }}>{theater?.location || 'City Center'}</small>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="ticket-label">Screen</div>
                                    <div className="ticket-value">{showtime?.screen || '1'}</div>
                                </div>
                            </div>

                            <div className="ticket-row">
                                <div>
                                    <div className="ticket-label">Date</div>
                                    <div className="ticket-value">{new Date(showtime?.startTime).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="ticket-label">Time</div>
                                    <div className="ticket-value">{new Date(showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>

                            <div className="ticket-label" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Seats</div>
                            <div className="seat-grid">
                                {booking.seats.map(seat => (
                                    <div key={seat} className="seat-box">{seat}</div>
                                ))}
                            </div>
                        </div>

                        <div className="ticket-footer">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking._id}`}
                                alt="QR Code"
                                className="qr-code"
                            />
                            <div className="ticket-id">ID: {booking._id.toUpperCase().slice(-8)}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                                Booked on: {new Date(booking.createdAt).toLocaleString()}
                            </div>
                            <div className="total-amount">Paid: ₹{booking.totalAmount}</div>
                            <div style={{ fontSize: '0.6rem', color: '#999', marginTop: '1rem', fontStyle: 'italic' }}>
                                * This is an electronically generated receipt. No signature required.
                                <br />Shown at the cinema entrance for entry.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action-buttons hide-on-download">
                    <button className="btn btn-outline" onClick={() => navigate('/home')}>
                        <Home size={18} style={{ marginRight: '0.5rem' }} /> Home
                    </button>
                    <button className="btn btn-primary" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center' }}>
                        <Download size={18} style={{ marginRight: '0.5rem' }} /> Download Ticket
                    </button>
                    <button className="btn btn-ghost" style={{ color: 'white' }} onClick={() => window.print()}>
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
