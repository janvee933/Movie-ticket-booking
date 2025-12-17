import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader as LoaderIcon, RefreshCw } from 'lucide-react';

// ... (existing imports)

const Booking = () => {
    // ... (existing state)
    const [isRefreshing, setIsRefreshing] = useState(false);

    // ... (existing useEffect)

    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        console.log("Refreshing seat data...");
        try {
            // Re-fetch data
            const showtimesRes = await fetch(`http://localhost:5000/api/showtimes?movie=${id}`);
            if (!showtimesRes.ok) throw new Error("Failed to fetch showtimes");

            const showtimesData = await showtimesRes.json();
            console.log("Fresh showtimes data:", showtimesData);
            setShowtimes(showtimesData);

            // Update selected showtime if exists
            let statusMessage = "Seats refreshed!";
            if (selectedShowtime) {
                const updatedShow = showtimesData.find(s => s._id === selectedShowtime._id);
                if (updatedShow) {
                    console.log("Updating current showtime:", updatedShow);
                    setSelectedShowtime(updatedShow);
                } else {
                    console.warn("Selected showtime no longer exists");
                }
            }

            // Clear selection (Free seats)
            if (selectedSeats.length > 0) {
                console.log("Clearing selected seats");
                setSelectedSeats([]);
                statusMessage += " Selection cleared.";
            }

            // Optional: User Feedback
            // window.alert(statusMessage); // Commented out to avoid spam, using console for now unless user requests visible feedback
        } catch (error) {
            console.error("Refresh failed:", error);
            alert("Failed to refresh seats. Please check your connection.");
        } finally {
            setTimeout(() => setIsRefreshing(false), 500); // Min styling delay
        }
    };

    // ... (rest of component)

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
                                title="Refresh Availability & Clear Selection"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <RefreshCw size={20} className={isRefreshing ? 'spin-anim' : ''} />
                            </button>
                        </div>

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
