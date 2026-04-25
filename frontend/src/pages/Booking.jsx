import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader as LoaderIcon, RefreshCw, Armchair, Check, Smartphone, QrCode, CreditCard, Banknote, ShieldCheck, Ticket } from 'lucide-react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
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
    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'qr', 'card', 'netbanking', 'wallet', 'cash'
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
        
        if (paymentMethod === 'upi' && !upiId && !upiApp) {
            alert("Please enter UPI ID or select an app.");
            return;
        }

        setIsProcessing(true);
        
        try {
            if (paymentMethod === 'upi' || paymentMethod === 'qr' || paymentMethod === 'wallet' || paymentMethod === 'netbanking') {
                setPaymentStage('verifying');
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setPaymentStage('approving');
                // Longer delay for user to "approve" on mobile
                await new Promise(resolve => setTimeout(resolve, 3000));
                setPaymentStage('success');
            } else if (paymentMethod === 'card') {
                setPaymentStage('verifying');
                await new Promise(resolve => setTimeout(resolve, 2000));
                setPaymentStage('success');
            } else {
                // Cash - immediate
                setPaymentStage('success');
            }

            const token = localStorage.getItem('token');
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    showtimeId: selectedShowtime._id,
                    seats: selectedSeats.map(s => s.id),
                    totalAmount: calculateTotal(),
                    paymentMethod,
                    phoneNumber,
                    couponCode: appliedCoupon?.code || null,
                    customerName
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPaymentSuccess(true);
                await new Promise(resolve => setTimeout(resolve, 1500));
                navigate(`/booking-success/${data._id}`);
            } else {
                alert(data.message || "Booking failed.");
                setIsProcessing(false);
                setPaymentStage('none');
            }
        } catch (error) {
            console.error("Booking error:", error);
            alert("Something went wrong.");
            setIsProcessing(false);
            setPaymentStage('none');
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
                                <h2 className="mb-4 fw-bold">Checkout</h2>
                                
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
                                            <ShieldCheck size={14} /> Secure
                                        </div>
                                    </div>

                                    {/* Payment Tabs */}
                                    <div className="payment-tabs">
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('upi')}
                                        >
                                            <Smartphone className="tab-icon" />
                                            <span>UPI</span>
                                        </div>
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'qr' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('qr')}
                                        >
                                            <QrCode className="tab-icon" />
                                            <span>QR</span>
                                        </div>
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('card')}
                                        >
                                            <CreditCard className="tab-icon" />
                                            <span>Card</span>
                                        </div>
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('netbanking')}
                                        >
                                            <RefreshCw className="tab-icon" />
                                            <span>Bank</span>
                                        </div>
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'wallet' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('wallet')}
                                        >
                                            <Ticket className="tab-icon" />
                                            <span>Wallet</span>
                                        </div>
                                        <div 
                                            className={`payment-tab ${paymentMethod === 'cash' ? 'active' : ''}`}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            <Banknote className="tab-icon" />
                                            <span>Cash</span>
                                        </div>
                                    </div>

                                    {/* Payment Details Panel */}
                                    <div className="payment-details-panel">
                                        {paymentMethod === 'upi' && (
                                            <div className="upi-section">
                                                <div className="upi-apps" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                                    {['gpay', 'phonepe', 'paytm', 'amazon', 'fampay', 'navi', 'whatsapp'].map(app => (
                                                        <div 
                                                            key={app}
                                                            className={`upi-app-btn ${upiApp === app ? 'selected' : ''}`}
                                                            onClick={() => setUpiApp(app)}
                                                            style={{ padding: '0.5rem', fontSize: '0.65rem' }}
                                                        >
                                                            <div className="fw-bold">{
                                                                app === 'gpay' ? 'GPay' : 
                                                                app === 'phonepe' ? 'PhonePe' : 
                                                                app === 'paytm' ? 'Paytm' : 
                                                                app === 'amazon' ? 'Amazon' :
                                                                app === 'fampay' ? 'FamPay' :
                                                                app === 'navi' ? 'Navi' : 'WhatsApp'
                                                            }</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="form-group">
                                                    <label className="text-muted small mb-2">Or enter UPI ID</label>
                                                    <div className="input-group">
                                                        <input 
                                                            type="text" 
                                                            className="form-control bg-dark text-white border-secondary" 
                                                            placeholder="username@bankid" 
                                                            value={upiId}
                                                            onChange={(e) => setUpiId(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && confirmBooking()}
                                                        />
                                                        <Button 
                                                            variant="primary" 
                                                            onClick={confirmBooking}
                                                            className="px-3"
                                                        >
                                                            Pay
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'qr' && (
                                            <div className="text-center">
                                                <p className="small text-muted mb-3">Scan this QR code using any UPI app</p>
                                                <div className="qr-container">
                                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example" alt="Scan QR" className="qr-code-img" />
                                                </div>
                                                <div className="payment-timer fw-bold">Expires in: 04:59</div>
                                            </div>
                                        )}

                                        {paymentMethod === 'card' && (
                                            <div className="card-section">
                                                <div className="visa-card-mock">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="fw-bold fs-4 italic text-white">VISA</div>
                                                        <div className="small opacity-75">Debit Card</div>
                                                    </div>
                                                    <div className="fs-5 tracking-widest text-white py-2">**** **** **** 4242</div>
                                                    <div className="d-flex justify-content-between align-items-end">
                                                        <div className="small">CARD HOLDER</div>
                                                        <div className="small">EXPIRES</div>
                                                    </div>
                                                </div>
                                                <div className="card-form-grid">
                                                    <div className="form-group col-span-2 mb-3" style={{ gridColumn: 'span 2' }}>
                                                        <input className="form-control bg-dark text-white border-secondary" placeholder="Card Number" />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <input className="form-control bg-dark text-white border-secondary" placeholder="MM/YY" />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <input className="form-control bg-dark text-white border-secondary" placeholder="CVV" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <div className="net-banking-section">
                                                <p className="small text-muted mb-3">Select your bank</p>
                                                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                                                        <div key={bank} className="p-2 border border-secondary border-opacity-25 rounded-2 cursor-pointer text-center hover-border-primary" style={{ fontSize: '0.8rem' }}>
                                                            {bank}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'wallet' && (
                                            <div className="wallet-section">
                                                <p className="small text-muted mb-3">Popular Wallets</p>
                                                <div className="d-flex flex-column gap-2">
                                                    {['Amazon Pay', 'Mobikwik', 'Freecharge', 'JioMoney'].map(wallet => (
                                                        <div key={wallet} className="d-flex justify-content-between p-2 border border-secondary border-opacity-25 rounded-2 cursor-pointer align-items-center">
                                                            <span style={{ fontSize: '0.85rem' }}>{wallet}</span>
                                                            <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'cash' && (
                                            <div className="text-center py-4">
                                                <div className="mb-3">
                                                    <Banknote size={40} className="text-success opacity-50" />
                                                </div>
                                                <h6>Pay at Counter</h6>
                                                <p className="small text-muted px-4">Pay cash at the theater box office 20 minutes before the show start time.</p>
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
