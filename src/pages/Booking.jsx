import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader as LoaderIcon } from 'lucide-react';
import './Booking.css';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Selection States
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Configuration
    const rows = 8;
    const cols = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Movie
                const movieRes = await fetch(`http://localhost:5000/api/movies/${id}`);
                const movieData = await movieRes.json();
                setMovie(movieData);

                // Fetch Showtimes for this movie
                const showtimesRes = await fetch(`http://localhost:5000/api/showtimes?movie=${id}`);
                const showtimesData = await showtimesRes.json();
                setShowtimes(showtimesData);

                // Set initial date if available
                if (showtimesData.length > 0) {
                    const uniqueDates = [...new Set(showtimesData.map(s => new Date(s.startTime).toDateString()))];
                    if (uniqueDates.length > 0) {
                        const firstDate = uniqueDates[0];
                        setSelectedDate(firstDate);

                        // Auto-select first showtime of this date
                        const showsForDate = showtimesData.filter(s => new Date(s.startTime).toDateString() === firstDate);
                        if (showsForDate.length > 0) {
                            setSelectedShowtime(showsForDate[0]);
                        }
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Derived Data
    const availableDates = [...new Set(showtimes.map(s => new Date(s.startTime).toDateString()))];

    const showtimesForDate = showtimes.filter(s =>
        new Date(s.startTime).toDateString() === selectedDate
    );

    // Helpers
    const getSeatTier = (rowIndex) => {
        if (rowIndex >= 6) return { name: 'VIP', price: 500, color: 'var(--color-accent)' };
        if (rowIndex >= 2) return { name: 'Premium', price: 300, color: 'var(--color-primary)' };
        return { name: 'Standard', price: 200, color: '#6b7280' };
    };

    const getRowLabel = (index) => String.fromCharCode(65 + index);

    const toggleSeat = (row, col, price, tier) => {
        const seatLabel = `${getRowLabel(row)}${col + 1}`; // e.g. A1
        const seatId = seatLabel; // Using label as ID for simplicity match with backend

        if (selectedSeats.find(s => s.id === seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
        } else {
            // Check if max seats reached? (Optional)
            setSelectedSeats([...selectedSeats, { id: seatId, label: seatLabel, price, tier }]);
        }
    };

    const calculateTotal = () => {
        // Use showtime price if available, else usage default tier price override?
        // Actually, backend showtime has a base price. 
        // For this demo, let's stick to the tier-based pricing in UI + Showtime base price?
        // Prioritizing Tier Price for complex logic, but technically showtime.price should rule.
        // Let's add seat price + booking fee.

        const seatTotal = selectedSeats.reduce((total, seat) => total + seat.price, 0);
        const fee = selectedSeats.length * 30;
        return seatTotal + fee;
    };

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to book tickets");
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    showtimeId: selectedShowtime._id,
                    seats: selectedSeats.map(s => s.label),
                    totalAmount: calculateTotal()
                })
            });

            if (res.ok) {
                // navigate('/profile'); // Old redirect
                const bookingData = await res.json();
                navigate(`/booking-success/${bookingData._id}`);
            } else {
                const err = await res.json();
                alert(`Booking Failed: ${err.message}`);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed due to network error');
        }
    };

    if (loading) return <div className="booking-page"><div className="container" style={{ paddingTop: '100px' }}>Loading...</div></div>;
    if (!movie) return <div className="booking-page"><div className="container" style={{ paddingTop: '100px' }}>Movie not found</div></div>;

    return (
        <div className="booking-page">
            <div className="container booking-container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft /> Back
                </button>

                <div className="booking-grid">
                    <div className="seat-selection">
                        <h2 className="page-title">Select Seats</h2>

                        {/* Showtimes must be selected first */}
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Select Showtime</h3>
                            <div className="selection-group">
                                <label><Calendar size={16} /> Date</label>
                                <div className="chips">
                                    {availableDates.length > 0 ? availableDates.map((date) => (
                                        <button
                                            key={date}
                                            className={`chip ${selectedDate === date ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedShowtime(null);
                                            }}
                                        >
                                            {date}
                                        </button>
                                    )) : <p className="text-muted">No shows available</p>}
                                </div>
                            </div>
                            <div className="selection-group">
                                <label><Clock size={16} /> Time</label>
                                <div className="chips">
                                    {showtimesForDate.map((show) => (
                                        <button
                                            key={show._id}
                                            className={`chip ${selectedShowtime?._id === show._id ? 'active' : ''}`}
                                            onClick={() => setSelectedShowtime(show)}
                                        >
                                            {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <span style={{ fontSize: '0.8em', opacity: 0.7, marginLeft: '4px' }}>({show.screen})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedShowtime && (
                            <>
                                <div className="screen-container">
                                    <div className="screen"></div>
                                    <p className="screen-text">SCREEN ({selectedShowtime.screen})</p>
                                </div>

                                <div className="seats-grid-wrapper">
                                    <div className="seats-grid">
                                        {Array.from({ length: rows }).map((_, row) => {
                                            const tier = getSeatTier(row);
                                            return (
                                                <div key={row} className="seat-row">
                                                    <span className="row-label">{getRowLabel(row)}</span>
                                                    {Array.from({ length: cols }).map((_, col) => {
                                                        const seatLabel = `${getRowLabel(row)}${col + 1}`;
                                                        const isSelected = selectedSeats.find(s => s.id === seatLabel);

                                                        // Check if seat is booked in showtime (from backend)
                                                        // showtime.bookedSeats is array of strings e.g. ["A1", "B2"]
                                                        const isOccupied = selectedShowtime.bookedSeats?.includes(seatLabel);

                                                        return (
                                                            <button
                                                                key={col}
                                                                className={`seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                                                                style={{
                                                                    '--seat-color': tier.color,
                                                                    borderColor: isSelected ? 'white' : 'transparent',
                                                                    cursor: isOccupied ? 'not-allowed' : 'pointer'
                                                                }}
                                                                onClick={() => !isOccupied && toggleSeat(row, col, tier.price, tier.name)}
                                                                disabled={isOccupied}
                                                                title={`${tier.name} - ₹${tier.price} (${seatLabel})`}
                                                            >
                                                                <span className="seat-number">{col + 1}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Seat Legend */}
                        <div className="seat-legend">
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: '#2a2a35', border: '1px solid rgba(255,255,255,0.2)' }}></div>
                                <span>Available</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: 'var(--color-primary)', boxShadow: '0 0 10px var(--color-primary)' }}></div>
                                <span>Selected</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: '#2a2a35', opacity: 0.5, cursor: 'not-allowed' }}></div>
                                <span>Occupied</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: 'var(--color-accent)' }}></div>
                                <span>VIP</span>
                            </div>
                        </div>

                        {selectedShowtime && (
                            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)' }}>
                                {(() => {
                                    const totalSeats = rows * cols;
                                    const bookedCount = selectedShowtime.bookedSeats ? selectedShowtime.bookedSeats.length : 0;
                                    const availableCount = totalSeats - bookedCount;
                                    return <p>{availableCount} seats available</p>;
                                })()}
                            </div>
                        )}

                    </div>

                    <div className="booking-summary">
                        <div className="summary-card">
                            <img src={movie.image} alt={movie.title} className="summary-poster" />
                            <div className="summary-info">
                                <h3>{movie.title}</h3>
                                <p className="summary-genre">{movie.genre}</p>
                            </div>

                            {/* Summary Content */}
                            <div className="price-summary">
                                <div className="price-row">
                                    <span>Showtime</span>
                                    <span>
                                        {selectedShowtime
                                            ? `${new Date(selectedShowtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                            : '-'}
                                    </span>
                                </div>
                                <div className="price-row">
                                    <span>Seats</span>
                                    <span className="seat-list">
                                        {selectedSeats.length > 0
                                            ? selectedSeats.map(s => s.label).join(', ')
                                            : '-'}
                                    </span>
                                </div>
                                <div className="price-row">
                                    <span>Tickets</span>
                                    <span>₹{selectedSeats.reduce((acc, s) => acc + s.price, 0)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Fee</span>
                                    <span>₹{selectedSeats.length * 30}</span>
                                </div>
                                <div className="price-total">
                                    <span>Total</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-block"
                                disabled={selectedSeats.length === 0 || !selectedShowtime}
                                onClick={handleBooking}
                            >
                                {selectedSeats.length === 0 ? 'Select Seats' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
