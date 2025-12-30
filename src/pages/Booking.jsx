import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader as LoaderIcon, RefreshCw } from 'lucide-react';
import './Booking.css';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State Variables
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dynamic Seat Layout
    const getScreenLayout = () => {
        if (!selectedShowtime || !selectedShowtime.theater || !selectedShowtime.theater.screens) {
            return { rows: 8, cols: 10 }; // Default
        }
        const screenConfig = selectedShowtime.theater.screens.find(s => s.name === selectedShowtime.screen);
        return {
            rows: screenConfig?.rows || 8,
            cols: screenConfig?.cols || 10
        };
    };

    const { rows, cols } = getScreenLayout();

    // Fetch Movie and Showtimes
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Movie Details
                const movieRes = await fetch(`/api/movies/${id}`);
                if (!movieRes.ok) throw new Error("Failed to fetch movie details");
                const movieData = await movieRes.json();
                setMovie(movieData);

                // Fetch Showtimes
                const showtimesRes = await fetch(`/api/showtimes?movie=${id}`);
                if (!showtimesRes.ok) throw new Error("Failed to fetch showtimes");
                const showtimesData = await showtimesRes.json();
                setShowtimes(showtimesData);

                // Set initial date if available
                if (showtimesData.length > 0) {
                    const dates = [...new Set(showtimesData.map(s => new Date(s.startTime).toLocaleDateString()))];
                    if (dates.length > 0) {
                        const firstDate = dates[0];
                        setSelectedDate(firstDate);

                        // Auto-select first showtime for this date
                        const firstShowtime = showtimesData.find(s => new Date(s.startTime).toLocaleDateString() === firstDate);
                        if (firstShowtime) setSelectedShowtime(firstShowtime);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Could not load booking data.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Handle Refresh
    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        try {
            const showtimesRes = await fetch(`/api/showtimes?movie=${id}`);
            if (!showtimesRes.ok) throw new Error("Failed to fetch showtimes");
            const showtimesData = await showtimesRes.json();
            setShowtimes(showtimesData);

            if (selectedShowtime) {
                const updatedShow = showtimesData.find(s => s._id === selectedShowtime._id);
                if (updatedShow) setSelectedShowtime(updatedShow);
            }
            // Clear selection on refresh to avoid conflicts
            setSelectedSeats([]);
        } catch (error) {
            console.error(error);
            alert("Failed to refresh.");
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    // Derived State: Available Dates
    const availableDates = [...new Set(showtimes.map(s => new Date(s.startTime).toLocaleDateString()))];

    // Derived State: Showtimes for Selected Date
    const showtimesForDate = showtimes.filter(s => new Date(s.startTime).toLocaleDateString() === selectedDate);

    // Helpers
    const getRowLabel = (index) => String.fromCharCode(65 + index); // 0 -> A, 1 -> B

    const getSeatTier = (rowIndex) => {
        if (rowIndex >= rows - 2) return { name: 'VIP', price: 300, color: 'var(--color-accent)' };
        return { name: 'Standard', price: 200, color: '#4b5563' };
    };

    // Toggle Seat Selection
    const toggleSeat = (row, col, price, type) => {
        if (!selectedShowtime) {
            alert("Please select a showtime first!");
            return;
        }

        const seatLabel = `${getRowLabel(row)}${col + 1}`; // e.g., A1, B5
        const isSelected = selectedSeats.find(s => s.id === seatLabel);

        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatLabel));
        } else {
            // Max 8 seats limit
            if (selectedSeats.length >= 8) {
                alert("You can only select up to 8 seats.");
                return;
            }
            setSelectedSeats([...selectedSeats, { id: seatLabel, label: seatLabel, price }]);
        }
    };

    const calculateTotal = () => {
        // Base ticket price + booking fee
        const ticketTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
        const fees = selectedSeats.length * 30; // 30 per ticket fee
        return ticketTotal + fees;
    };

    const handleBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to book tickets.");
            navigate('/login');
            return;
        }

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    showtimeId: selectedShowtime._id,
                    seats: selectedSeats.map(s => s.id),
                    totalAmount: calculateTotal()
                })
            });

            const data = await res.json();
            if (res.ok) {
                navigate(`/booking-success/${data._id}`);
            } else {
                alert(data.message || "Booking failed.");
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Something went wrong.");
        }
    };

    if (loading) return <div className="loader-container"><LoaderIcon className="spin-anim" /></div>;
    if (error) return <div className="error-container">{error}</div>;
    if (!movie) return <div className="error-container">Movie not found</div>;

    return (
        <div className="booking-page">
            <div className="container booking-container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft /> Back
                </button>

                <div className="booking-grid">
                    <div className="seat-selection">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 className="page-title" style={{ margin: 0 }}>Select Seats</h2>
                            <button
                                onClick={handleRefresh}
                                className="btn-refresh"
                                title="Refresh"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                            >
                                <RefreshCw size={20} className={isRefreshing ? 'spin-anim' : ''} />
                            </button>
                        </div>

                        {/* Showtime Selection */}
                        <div className="selection-panel">
                            <h3>Select Showtime</h3>

                            {/* Date Selection */}
                            <div className="selection-group">
                                <label><Calendar size={16} /> Date</label>
                                <div className="chips">
                                    {availableDates.length > 0 ? availableDates.map((date) => (
                                        <button
                                            key={date}
                                            className={`chip ${selectedDate === date ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setSelectedShowtime(null); // Reset showtime on date change
                                                setSelectedSeats([]); // Clear seats
                                            }}
                                        >
                                            {date}
                                        </button>
                                    )) : <p className="text-muted">No shows available</p>}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="selection-group">
                                <label><Clock size={16} /> Time</label>
                                <div className="chips">
                                    {showtimesForDate.map((show) => (
                                        <button
                                            key={show._id}
                                            className={`chip ${selectedShowtime?._id === show._id ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedShowtime(show);
                                                setSelectedSeats([]); // Clear seats on showtime change
                                            }}
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

                                                        // Check occupation
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

                        {!selectedShowtime && (
                            <div className="empty-state">
                                <p>Please select a date and time to view seats.</p>
                            </div>
                        )}

                        {/* Legend */}
                        <div className="seat-legend">
                            <div className="legend-item"><div className="seat-dot" style={{ background: '#4b5563' }}></div> Available</div>
                            <div className="legend-item"><div className="seat-dot" style={{ background: 'var(--color-primary)' }}></div> Selected</div>
                            <div className="legend-item"><div className="seat-dot" style={{ background: '#2a2a35', border: '1px solid #444' }}></div> Booked</div>
                            <div className="legend-item"><div className="seat-dot" style={{ background: 'var(--color-accent)' }}></div> VIP</div>
                        </div>
                    </div>

                    <div className="booking-summary">
                        <div className="summary-card">
                            <img src={movie.image} alt={movie.title} className="summary-poster" />
                            <div className="summary-info">
                                <h3>{movie.title}</h3>
                                <p className="summary-genre">{movie.genre}</p>
                            </div>

                            <div className="price-summary">
                                <div className="price-row">
                                    <span>Showtime</span>
                                    <span>{selectedShowtime ? new Date(selectedShowtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                </div>
                                <div className="price-row">
                                    <span>Seats</span>
                                    <span className="seat-list">{selectedSeats.length > 0 ? selectedSeats.map(s => s.label).join(', ') : '-'}</span>
                                </div>
                                <div className="price-row">
                                    <span>Total Price</span>
                                    <span>₹{calculateTotal()}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-block"
                                disabled={selectedSeats.length === 0}
                                onClick={handleBooking}
                            >
                                {selectedSeats.length === 0 ? 'Select Seats' : 'Book Tickets'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Sticky Footer */}
            {selectedSeats.length > 0 && (
                <div className="mobile-booking-footer">
                    <div className="mobile-footer-info">
                        <span className="footer-seats">{selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}</span>
                        <span className="footer-price">₹{calculateTotal()}</span>
                    </div>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={handleBooking}
                    >
                        Book Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default Booking;
