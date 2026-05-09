import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader as LoaderIcon, RefreshCw, Armchair, Check, Smartphone, QrCode, CreditCard, Banknote, ShieldCheck, Ticket } from 'lucide-react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State Variables
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Coupon States
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [couponStatus, setCouponStatus] = useState('none');
    
    // Booking Flow States
    const [bookingStep, setBookingStep] = useState(1); // 1: Seats, 2: Checkout
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' (Razorpay) or 'cash'
    const [upiApp, setUpiApp] = useState('gpay');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStage, setPaymentStage] = useState('none'); // 'verifying', 'approving', 'success'
    const [paymentSuccess, setPaymentSuccess] = useState(false);

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

        // Polling for live seat updates every 10 seconds
        const pollInterval = setInterval(async () => {
            if (bookingStep === 1) { // Only poll when on selection screen
                try {
                    const res = await fetch(`/api/showtimes?movie=${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setShowtimes(data);
                        // Update selected showtime object to get new bookedSeats
                        if (selectedShowtime) {
                            const updated = data.find(s => s._id === selectedShowtime._id);
                            if (updated) setSelectedShowtime(updated);
                        }
                    }
                } catch (e) { console.error("Poll error:", e); }
            }
        }, 10000);

        return () => clearInterval(pollInterval);
    }, [id, bookingStep]); // Re-run effect when step changes to start/stop polling

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
        const total = ticketTotal + fees - discountAmount;
        return total > 0 ? total : 0;
    };

    const handleApplyCoupon = async () => {
        if (!couponInput) return;
        setIsApplying(true);
        setCouponError('');
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/offers/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: couponInput })
            });

            const data = await res.json();
            
            if (res.ok) {
                const coupon = data.coupon;
                // Calculate discount logic based on code or general rule
                let calculatedDiscount = 0;
                const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
                
                if (coupon.code === 'EARLY25') {
                    calculatedDiscount = Math.round(subtotal * 0.25);
                } else if (coupon.code === 'SBI10') {
                    calculatedDiscount = Math.round(subtotal * 0.10);
                } else {
                    calculatedDiscount = 100; // Default flat discount
                }
                
                setAppliedCoupon(coupon);
                setDiscountAmount(calculatedDiscount);
                setCouponStatus('success');
            } else {
                setCouponError(data.message || 'Invalid or expired coupon code.');
                setAppliedCoupon(null);
                setDiscountAmount(0);
            }
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError('Error validating coupon.');
        } finally {
            setIsApplying(false);
        }
    };

    const handleBooking = () => {
        if (selectedSeats.length === 0) return;
        setBookingStep(2);
        window.scrollTo(0, 0);
    };

    const handleBackToSeats = () => {
        setBookingStep(1);
        window.scrollTo(0, 0);
    };

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const confirmBooking = async () => {
        if (!customerName) {
            alert("Please enter customer name.");
            return;
        }
        if (!phoneNumber) {
            alert("Please enter your mobile number.");
            return;
        }

        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const totalAmount = calculateTotal();

            // 1. Create Order on Backend
            const orderRes = await fetch('/api/payments/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: 'INR',
                    receipt: `rcpt_${Math.random().toString(36).substring(7)}`
                })
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json();
                throw new Error(errorData.message || "Order creation failed");
            }
            const order = await orderRes.json();

            // 2. Load Razorpay
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert("Razorpay SDK failed to load. Are you online?");
                setIsProcessing(false);
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id', // Use Env Var or Placeholder
                amount: order.amount,
                currency: order.currency,
                name: "CineTicket",
                description: `Booking for ${movie.title}`,
                image: movie.image,
                order_id: order.id,
                handler: async function (response) {
                    setPaymentStage('verifying');
                    
                    // Verify payment on backend
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        setPaymentStage('success');
                        
                        // Finalize Booking
                        const bookingRes = await fetch('/api/bookings', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                showtimeId: selectedShowtime._id,
                                seats: selectedSeats.map(s => s.id),
                                totalAmount: totalAmount,
                                paymentMethod: 'online', // Razorpay
                                phoneNumber,
                                customerName,
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id
                            })
                        });

                        const bookingData = await bookingRes.json();
                        if (bookingRes.ok) {
                            setPaymentSuccess(true);
                            navigate(`/booking-success/${bookingData._id}`);
                        } else {
                            alert(bookingData.message || "Booking finalization failed.");
                        }
                    } else {
                        alert("Payment verification failed.");
                    }
                    setIsProcessing(false);
                    setPaymentStage('none');
                },
                prefill: {
                    name: customerName || user?.name,
                    contact: phoneNumber,
                    email: user?.email || ""
                },
                theme: {
                    color: "#e50914"
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Razorpay error:", error);
            alert(`Payment Error: ${error.message || "Something went wrong"}`);
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="text-center pt-5 mt-5"><Spinner animation="border" variant="primary" /></div>;
    if (error) return <div className="text-center pt-5 mt-5 text-danger">{error}</div>;
    if (!movie) return <div className="text-center pt-5 mt-5">Movie not found</div>;

    return (
        <div className="booking-page text-white">
            <Container className="pt-5 mt-4">
                <Button variant="link" onClick={() => bookingStep === 2 ? setBookingStep(1) : navigate(-1)} className="text-decoration-none text-white-50 mb-3 ps-0">
                    <ArrowLeft size={20} /> {bookingStep === 2 ? 'Back to Seats' : 'Back'}
                </Button>

                {/* Step Indicator */}
                <div className="booking-steps mb-5">
                    <div className={`step-item ${bookingStep >= 1 ? 'active' : ''}`} onClick={() => bookingStep === 2 && setBookingStep(1)}>
                        <div className="step-count">1</div>
                        <div className="step-info">
                            <span className="step-title">Select Seats</span>
                        </div>
                    </div>
                    <div className={`step-line ${bookingStep >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-item ${bookingStep >= 2 ? 'active' : ''}`}>
                        <div className="step-count">2</div>
                        <div className="step-info">
                            <span className="step-title">Checkout</span>
                        </div>
                    </div>
                </div>

                <Row className="g-5">
                    {/* Left Column: Selection & Seats */}
                    <Col lg={8}>
                        {bookingStep === 1 ? (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="mb-0 fw-bold">Select Seats</h2>
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={handleRefresh}
                                        className="rounded-circle p-2"
                                        title="Refresh"
                                    >
                                        <RefreshCw size={18} className={isRefreshing ? 'spin-anim' : ''} />
                                    </Button>
                                </div>

                                {/* Showtime Selection */}
                                <div className="bg-dark bg-opacity-50 p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
                                    <h5 className="mb-3 text-uppercase fs-6 text-muted spacing-1">Select Showtime</h5>

                                    {/* Date Selection */}
                                    <div className="mb-4">
                                        <label className="text-muted small mb-2 d-flex align-items-center gap-2"><Calendar size={14} /> Date</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {availableDates.length > 0 ? availableDates.map((date) => (
                                                <Button
                                                    key={date}
                                                    variant={selectedDate === date ? 'primary' : 'outline-secondary'}
                                                    size="sm"
                                                    className="rounded-pill"
                                                    onClick={() => {
                                                        setSelectedDate(date);
                                                        setSelectedShowtime(null); // Reset showtime on date change
                                                        setSelectedSeats([]); // Clear seats
                                                    }}
                                                >
                                                    {date}
                                                </Button>
                                            )) : <p className="text-muted small">No shows available</p>}
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div>
                                        <label className="text-muted small mb-2 d-flex align-items-center gap-2"><Clock size={14} /> Time</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {showtimesForDate.map((show) => (
                                                <Button
                                                    key={show._id}
                                                    variant={selectedShowtime?._id === show._id ? 'primary' : 'outline-secondary'}
                                                    size="sm"
                                                    className="rounded-pill d-flex align-items-center gap-2"
                                                    onClick={() => {
                                                        setSelectedShowtime(show);
                                                        setSelectedSeats([]); // Clear seats on showtime change
                                                    }}
                                                >
                                                    {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    <Badge bg="light" text="dark" className="ms-1 opacity-75">{show.screen}</Badge>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {selectedShowtime ? (
                                    <>
                                        <div className="screen-container mb-5 perspective-500">
                                            <div className="screen bg-gradient-to-b from-white-20 to-transparent mb-3" style={{ height: '40px', transform: 'rotateX(-20deg)', boxShadow: '0 20px 30px rgba(255,255,255,0.05)' }}></div>
                                            <p className="text-center text-muted small letter-spacing-2">SCREEN ({selectedShowtime.screen})</p>
                                        </div>

                                        <div className="d-flex justify-content-center overflow-auto pb-4">
                                            <div className="d-flex flex-column gap-3 align-items-center">
                                                {Array.from({ length: rows }).map((_, row) => {
                                                    const tier = getSeatTier(row);
                                                    return (
                                                        <div key={row} className="d-flex gap-3 align-items-center">
                                                            <span className="text-muted small fw-bold" style={{ width: '20px' }}>{getRowLabel(row)}</span>
                                                            {Array.from({ length: cols }).map((_, col) => {
                                                                const seatLabel = `${getRowLabel(row)}${col + 1}`;
                                                                const isSelected = selectedSeats.find(s => s.id === seatLabel);
                                                                const isOccupied = selectedShowtime.bookedSeats?.includes(seatLabel);

                                                                return (
                                                                    <button
                                                                        key={col}
                                                                        disabled={isOccupied}
                                                                        onClick={() => !isOccupied && toggleSeat(row, col, tier.price, tier.name)}
                                                                        className={`
                                                                            btn btn-sm p-0 d-flex align-items-center justify-content-center
                                                                            ${isOccupied ? 'btn-secondary opacity-50' : isSelected ? '' : 'btn-outline-secondary'}
                                                                        `}
                                                                        style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            backgroundColor: isSelected ? tier.color : isOccupied ? '#333' : 'transparent',
                                                                            borderColor: isSelected ? 'white' : 'rgba(255,255,255,0.2)',
                                                                            color: isSelected ? 'white' : 'inherit',
                                                                            transition: 'all 0.2s',
                                                                            borderRadius: '6px 6px 4px 4px'
                                                                        }}
                                                                        title={`${tier.name} - ₹${tier.price} (${seatLabel})`}
                                                                    >
                                                                        <small style={{ fontSize: '0.65rem' }} className={isSelected ? 'fw-bold' : 'd-none d-hover-block'}>{col + 1}</small>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center gap-4 mt-4 py-3 border-top border-secondary border-opacity-25">
                                            <div className="d-flex align-items-center gap-2 small text-muted"><div className="rounded" style={{ width: '16px', height: '16px', border: '1px solid #666' }}></div> Available</div>
                                            <div className="d-flex align-items-center gap-2 small text-muted"><div className="rounded bg-primary" style={{ width: '16px', height: '16px' }}></div> Selected</div>
                                            <div className="d-flex align-items-center gap-2 small text-muted"><div className="rounded bg-secondary opacity-50" style={{ width: '16px', height: '16px' }}></div> Booked</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-5 bg-dark bg-opacity-25 rounded-3 border border-secondary border-opacity-10">
                                        <Armchair size={48} className="text-muted mb-3 opacity-25" />
                                        <p className="text-muted">Select a showtime to view available seats</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="checkout-selection slide-in">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        className="rounded-circle p-2" 
                                        onClick={handleBackToSeats}
                                    >
                                        <ArrowLeft size={18} />
                                    </Button>
                                    <h2 className="mb-0 fw-bold">Checkout</h2>
                                </div>
                                
                                <div className="bg-dark bg-opacity-50 p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
                                    <h5 className="mb-4 text-uppercase fs-6 text-muted spacing-1">Contact Information</h5>
                                    <div className="form-group mb-4">
                                        <label className="text-muted small mb-2">Customer Name</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            placeholder="Enter your name or person who will watch" 
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="text-muted small mb-2">Mobile Number</label>
                                        <input 
                                            type="tel" 
                                            className="form-control bg-dark text-white border-secondary" 
                                            placeholder="Enter your 10-digit mobile number" 
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                <div className="bg-dark bg-opacity-50 p-4 rounded-3 mb-4 border border-secondary border-opacity-25">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="text-uppercase fs-6 text-muted spacing-1 mb-0">Payment Method</h5>
                                        <div className="d-flex align-items-center gap-1 text-success small">
                                            <ShieldCheck size={14} /> Secure Razorpay
                                        </div>
                                    </div>

                                    <div className="payment-options d-flex flex-column gap-3">
                                        <div 
                                            className={`payment-method-card ${paymentMethod !== 'cash' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('online')}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="method-icon bg-primary bg-opacity-25 text-primary">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">Razorpay Secure Payment</div>
                                                    <div className="small text-muted">UPI, Cards, Netbanking, Wallets</div>
                                                </div>
                                                {paymentMethod !== 'cash' && <Check size={20} className="text-primary" />}
                                            </div>
                                        </div>

                                        <div 
                                            className={`payment-method-card ${paymentMethod === 'cash' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="method-icon bg-success bg-opacity-25 text-success">
                                                    <Banknote size={20} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="fw-bold">Pay at Theater</div>
                                                    <div className="small text-muted">Pay cash at the counter</div>
                                                </div>
                                                {paymentMethod === 'cash' && <Check size={20} className="text-success" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                                        {paymentMethod === 'cash' ? (
                                            <div className="text-center py-3">
                                                <p className="small text-muted mb-4 italic">Note: Please arrive 20 minutes before the show to pay and collect your tickets.</p>
                                                <Button 
                                                    variant="success" 
                                                    className="w-100 py-3 fw-bold rounded-3 shadow-lg"
                                                    onClick={confirmBooking}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? <Spinner size="sm" className="me-2" /> : 'Confirm Booking (Cash)'}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-3">
                                                <p className="small text-muted mb-4 italic">You will be redirected to Razorpay's secure payment gateway.</p>
                                                <Button 
                                                    variant="primary" 
                                                    className="w-100 py-3 fw-bold rounded-3 shadow-lg d-flex align-items-center justify-content-center gap-2"
                                                    onClick={confirmBooking}
                                                    disabled={isProcessing}
                                                >
                                                    {isProcessing ? <Spinner size="sm" /> : <><ShieldCheck size={20} /> Pay Now with Razorpay</>}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>

                    {/* Right Column: Summary */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <Card className="bg-dark bg-opacity-75 border border-secondary border-opacity-25 text-white shadow-lg backdrop-blur">
                                <Card.Body className="p-4">
                                    <div className="d-flex gap-3 mb-4">
                                        <img src={movie.image} alt={movie.title} className="rounded" style={{ width: '80px', height: '120px', objectFit: 'cover' }} />
                                        <div>
                                            <h4 className="h5 mb-1">{movie.title}</h4>
                                            <p className="text-muted small mb-2">{movie.genre}</p>
                                            <Badge bg="warning" text="dark">{movie.category}</Badge>
                                        </div>
                                    </div>

                                    <hr className="border-secondary opacity-25" />

                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">Screen</span>
                                        <span>{selectedShowtime ? selectedShowtime.screen : '-'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 small">
                                        <span className="text-muted">Showtime</span>
                                        <span>{selectedShowtime ? new Date(selectedShowtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4 small">
                                        <span className="text-muted">Seats</span>
                                        <span className="text-end" style={{ maxWidth: '150px' }}>
                                            {selectedSeats.length > 0 ? selectedSeats.map(s => s.label).join(', ') : '-'}
                                        </span>
                                    </div>

                                    {/* Coupon Section */}
                                    <div className="coupon-section mb-4">
                                        <div className="input-group input-group-sm">
                                            <input 
                                                type="text" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                placeholder="Enter Coupon (e.g. EARLY25)" 
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                disabled={appliedCoupon}
                                            />
                                            <Button 
                                                variant={appliedCoupon ? "outline-success" : "primary"} 
                                                onClick={handleApplyCoupon}
                                                disabled={isApplying || !couponInput || appliedCoupon}
                                            >
                                                {isApplying ? <Spinner size="sm" /> : appliedCoupon ? <Check size={16} /> : 'Apply'}
                                            </Button>
                                        </div>
                                        {couponStatus === 'success' && (
                                            <div className="mt-2 small text-success d-flex align-items-center gap-1">
                                                <Check size={14} /> Coupon applied! ₹{discountAmount} saved.
                                                <button 
                                                    className="btn btn-link btn-sm p-0 ms-auto text-muted" 
                                                    onClick={() => {
                                                        setAppliedCoupon(null);
                                                        setDiscountAmount(0);
                                                        setCouponStatus('none');
                                                        setCouponInput('');
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                        {couponError && (
                                            <div className="mt-2 small text-danger">{couponError}</div>
                                        )}
                                    </div>

                                    <hr className="border-secondary opacity-25" />

                                    <div className="price-breakdown mb-3">
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="text-muted">Subtotal</span>
                                            <span>₹{selectedSeats.reduce((acc, s) => acc + s.price, 0)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="text-muted">Booking fees</span>
                                            <span>₹{selectedSeats.length * 30}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="d-flex justify-content-between small mb-1 text-success">
                                                <span>Coupon Discount</span>
                                                <span>-₹{discountAmount}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-end mb-4">
                                        <span className="text-muted">Total Amount</span>
                                        <span className="h4 mb-0 text-primary">₹{calculateTotal()}</span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-100"
                                        disabled={selectedSeats.length === 0}
                                        onClick={bookingStep === 1 ? handleBooking : confirmBooking}
                                    >
                                        {bookingStep === 1 
                                            ? (selectedSeats.length === 0 ? 'Select Seats' : 'Proceed to Checkout') 
                                            : 'Confirm Booking'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Mobile Footer (visible only on small screens) */}
            {selectedSeats.length > 0 && (
                <div className="d-lg-none fixed-bottom bg-dark border-top border-secondary p-3 shadow-lg slide-up-anim">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="small text-muted">{selectedSeats.length} Seats</div>
                            <div className="h5 mb-0 text-white">₹{calculateTotal()}</div>
                        </div>
                        <Button variant="primary" onClick={bookingStep === 1 ? handleBooking : confirmBooking}>
                            {bookingStep === 1 ? 'Next' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Payment Processing Overlay */}
            {isProcessing && (
                <div className="payment-processing-overlay">
                    <div className="processing-content">
                        {paymentStage === 'verifying' && (
                            <>
                                <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                                <h3 className="text-white">Verifying Details...</h3>
                                <p className="text-muted">Please wait while we secure your connection.</p>
                            </>
                        )}
                        
                        {paymentStage === 'approving' && (
                            <>
                                <Smartphone size={60} className="text-primary mb-4 spin-anim" />
                                <h3 className="text-white">Waiting for Approval</h3>
                                <p className="text-muted">Please open your payment app and approve the request.</p>
                                <div className="mt-4 p-3 bg-dark rounded border border-secondary border-opacity-25">
                                    <div className="small text-white opacity-75">Merchant: MovieBooking Ltd</div>
                                    <div className="fw-bold fs-4 text-primary">₹{calculateTotal()}</div>
                                </div>
                            </>
                        )}

                        {paymentStage === 'success' && (
                            <>
                                <div className="success-icon-anim mb-4">
                                    <Check size={80} strokeWidth={3} />
                                </div>
                                <h2 className="text-white">Payment Successful!</h2>
                                <p className="text-muted">Your tickets have been booked.</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
