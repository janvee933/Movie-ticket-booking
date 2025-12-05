import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react';
import { movies } from '../data/movies';
import './Booking.css';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const movie = movies.find(m => m.id === parseInt(id));

    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Mock data for dates and times
    const dates = ['Today', 'Tomorrow', 'Fri, 8 Dec'];
    const times = ['10:30 AM', '1:15 PM', '4:30 PM', '7:45 PM', '10:00 PM'];

    // Seat Configuration
    const rows = 8;
    const cols = 10;

    // Define tiers
    const getSeatTier = (rowIndex) => {
        if (rowIndex >= 6) return { name: 'VIP', price: 500, color: 'var(--color-accent)' }; // Rows G-H
        if (rowIndex >= 2) return { name: 'Premium', price: 300, color: 'var(--color-primary)' }; // Rows C-F
        return { name: 'Standard', price: 200, color: '#6b7280' }; // Rows A-B
    };

    const getRowLabel = (index) => String.fromCharCode(65 + index); // 0 -> A, 1 -> B...

    const toggleSeat = (row, col, price, tier) => {
        const seatId = `${row}-${col}`;
        const seatLabel = `${getRowLabel(row)}${col + 1}`;

        if (selectedSeats.find(s => s.id === seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, { id: seatId, label: seatLabel, price, tier }]);
        }
    };

    const calculateTotal = () => {
        const ticketPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
        const fee = selectedSeats.length * 30; // Booking fee
        return ticketPrice + fee;
    };

    const handleBooking = () => {
        alert(`Booked ${selectedSeats.length} tickets for ${movie.title}!\nSeats: ${selectedSeats.map(s => s.label).join(', ')}\nTotal: ₹${calculateTotal()}`);
        navigate('/');
    };

    if (!movie) return <div>Movie not found</div>;

    return (
        <div className="booking-page">
            <div className="container booking-container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft /> Back
                </button>

                <div className="booking-grid">
                    <div className="seat-selection">
                        <h2 className="page-title">Select Seats</h2>

                        <div className="screen-container">
                            <div className="screen"></div>
                            <p className="screen-text">SCREEN</p>
                        </div>

                        <div className="seats-grid-wrapper">
                            <div className="seats-grid">
                                {Array.from({ length: rows }).map((_, row) => {
                                    const tier = getSeatTier(row);
                                    return (
                                        <div key={row} className="seat-row">
                                            <span className="row-label">{getRowLabel(row)}</span>
                                            {Array.from({ length: cols }).map((_, col) => {
                                                const seatId = `${row}-${col}`;
                                                const isSelected = selectedSeats.find(s => s.id === seatId);
                                                // Randomly occupy some seats
                                                const isOccupied = (row * col + row + col) % 9 === 0;

                                                return (
                                                    <button
                                                        key={col}
                                                        className={`seat ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                                                        style={{
                                                            '--seat-color': tier.color,
                                                            borderColor: isSelected ? 'white' : 'transparent'
                                                        }}
                                                        onClick={() => !isOccupied && toggleSeat(row, col, tier.price, tier.name)}
                                                        disabled={isOccupied}
                                                        title={`${tier.name} - ₹${tier.price} (${getRowLabel(row)}${col + 1})`}
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

                        <div className="seat-legend">
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: '#2a2a35' }}></div>
                                <span>Occupied</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: '#6b7280' }}></div>
                                <span>Standard (₹200)</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: 'var(--color-primary)' }}></div>
                                <span>Premium (₹300)</span>
                            </div>
                            <div className="legend-item">
                                <div className="seat-dot" style={{ background: 'var(--color-accent)' }}></div>
                                <span>VIP (₹500)</span>
                            </div>
                        </div>
                    </div>

                    <div className="booking-summary">
                        <div className="summary-card">
                            <img src={movie.image} alt={movie.title} className="summary-poster" />
                            <div className="summary-info">
                                <h3>{movie.title}</h3>
                                <p className="summary-genre">{movie.genre}</p>
                            </div>

                            <div className="selection-group">
                                <label><Calendar size={16} /> Date</label>
                                <div className="chips">
                                    {dates.map((date, i) => (
                                        <button
                                            key={i}
                                            className={`chip ${selectedDate === i ? 'active' : ''}`}
                                            onClick={() => setSelectedDate(i)}
                                        >
                                            {date}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="selection-group">
                                <label><Clock size={16} /> Time</label>
                                <div className="chips">
                                    {times.map((time, i) => (
                                        <button
                                            key={i}
                                            className={`chip ${selectedTime === i ? 'active' : ''}`}
                                            onClick={() => setSelectedTime(i)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="price-summary">
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
                                disabled={selectedSeats.length === 0}
                                onClick={handleBooking}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
