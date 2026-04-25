import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, X, Armchair, Info } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminShowtimes = () => {
    const { adminToken } = useAuth();
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState(null);
    const [bookedSeats, setBookedSeats] = useState([]);
    
    const [formData, setFormData] = useState({
        movie: '',
        theater: '',
        screen: 'Screen 1',
        startTime: '',
        price: '',
        date: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const [showtimesRes, moviesRes, theatersRes] = await Promise.all([
                fetch('/api/showtimes'),
                fetch('/api/movies'),
                fetch('/api/theaters')
            ]);

            setShowtimes(await showtimesRes.json());
            setMovies(await moviesRes.json());
            setTheaters(await theatersRes.json());
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openSeatControl = async (show) => {
        setSelectedShow(show);
        setIsSeatModalOpen(true);
        try {
            const token = adminToken || localStorage.getItem('admin_token');
            const res = await fetch(`/api/admin/showtimes/${show._id}/seats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBookedSeats(data.bookedSeats || []);
        } catch (error) {
            console.error('Error fetching seats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = adminToken || localStorage.getItem('admin_token');
        const combinedDate = new Date(`${formData.date}T${formData.startTime}`);

        const payload = {
            movie: formData.movie,
            theater: formData.theater,
            screen: formData.screen,
            startTime: combinedDate,
            price: Number(formData.price)
        };

        try {
            await fetch('/api/showtimes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this showtime?')) {
            const token = adminToken || localStorage.getItem('admin_token');
            await fetch(`/api/showtimes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        }
    };

    if (loading) return <div className="admin-page-container">Loading schedules...</div>;

    // Helper to render seat grid
    const renderSeatGrid = () => {
        if (!selectedShow) return null;
        
        // Find theater screen layout
        const theater = theaters.find(t => t._id === selectedShow.theater?._id);
        const screen = theater?.screens?.find(s => s.name === selectedShow.screen);
        
        const rows = screen?.rows || 8;
        const cols = screen?.cols || 10;
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        return (
            <div className="seat-control-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: `repeat(${cols}, 1fr)`, 
                gap: '8px',
                padding: '20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px'
            }}>
                {Array.from({ length: rows }).map((_, r) => (
                    Array.from({ length: cols }).map((_, c) => {
                        const seatId = `${alphabet[r]}${c + 1}`;
                        const isBooked = bookedSeats.includes(seatId);
                        return (
                            <div 
                                key={seatId} 
                                className={`seat-item-admin ${isBooked ? 'booked' : 'available'}`}
                                title={seatId}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '6px',
                                    background: isBooked ? '#ef4444' : 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    cursor: 'default',
                                    color: isBooked ? 'white' : 'rgba(255,255,255,0.5)',
                                    border: isBooked ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                {seatId}
                            </div>
                        );
                    })
                ))}
            </div>
        );
    };

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">Showtime Schedule</h1>
                <button
                    className="btn-primary-add"
                    onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setFormData({ movie: '', theater: '', screen: 'Screen 1', startTime: '', price: '', date: today });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} /> Add Schedule
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Theater / Screen</th>
                            <th>Date & Time</th>
                            <th>Price</th>
                            <th>Status (Seats)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map(show => (
                            <tr key={show._id}>
                                <td>
                                    <div style={{ fontWeight: '600', color: 'white' }}>{show.movie?.title || 'Unknown Movie'}</div>
                                    <div className="badge info" style={{ fontSize: '0.7rem', marginTop: '4px' }}>{show.movie?.category}</div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <MapPin size={14} className="text-muted" />
                                        <span>{show.theater?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="text-muted small ps-4">{show.screen}</div>
                                </td>
                                <td>
                                    <div className="d-flex flex-column gap-1">
                                        <div className="d-flex align-items-center gap-2">
                                            <Calendar size={14} className="text-muted" />
                                            <span>{new Date(show.startTime).toLocaleDateString()}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Clock size={14} className="text-muted" />
                                            <span>{new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="text-success fw-bold">₹{show.price}</span></td>
                                <td>
                                    <button onClick={() => openSeatControl(show)} className="btn-glass px-3 py-1 rounded-pill small" style={{ fontSize: '0.8rem' }}>
                                        <Armchair size={14} className="me-1" /> View Seats
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(show._id)} className="btn-icon delete" title="Delete Schedule">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Schedule Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Schedule New Showtime</h2>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group mb-4">
                                    <label className="form-label">Select Movie</label>
                                    <select className="form-select" value={formData.movie} onChange={e => setFormData({ ...formData, movie: e.target.value })} required>
                                        <option value="">-- Choose Movie --</option>
                                        {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                                    </select>
                                </div>
                                <div className="form-group mb-4">
                                    <label className="form-label">Select Theater</label>
                                    <select className="form-select" value={formData.theater} onChange={e => setFormData({ ...formData, theater: e.target.value })} required>
                                        <option value="">-- Choose Theater --</option>
                                        {theaters.map(t => <option key={t._id} value={t._id}>{t.name} ({t.city})</option>)}
                                    </select>
                                </div>
                                <div className="form-grid two-col mb-4">
                                    <div className="form-group">
                                        <label className="form-label">Screen</label>
                                        <select className="form-select" value={formData.screen} onChange={e => setFormData({ ...formData, screen: e.target.value })} required>
                                            <option value="Screen 1">Screen 1</option>
                                            <option value="Screen 2">Screen 2</option>
                                            <option value="Screen 3">Screen 3</option>
                                            <option value="IMAX">IMAX</option>
                                            <option value="VIP">VIP</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ticket Price (₹)</label>
                                        <input type="number" className="form-input" placeholder="250" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="form-grid two-col">
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time</label>
                                        <input type="time" className="form-input" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-submit">Create Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Seat Control Modal */}
            <Modal show={isSeatModalOpen} onHide={() => setIsSeatModalOpen(false)} centered size="lg" contentClassName="modal-content">
                <div className="modal-header border-bottom-0 pb-0">
                    <h5 className="modal-title">Seat Availability - {selectedShow?.movie?.title}</h5>
                    <button className="btn-close" onClick={() => setIsSeatModalOpen(false)}><X size={20} /></button>
                </div>
                <div className="modal-body text-center">
                    <div className="mb-4">
                        <div className="d-flex justify-content-center gap-4 mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}></div>
                                <span className="small text-muted">Available</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 16, height: 16, background: '#ef4444', borderRadius: 2 }}></div>
                                <span className="small text-muted">Booked</span>
                            </div>
                        </div>
                        <div className="screen-indicator mb-5" style={{ 
                            height: '6px', 
                            background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
                            width: '80%',
                            margin: '0 auto',
                            borderRadius: '100%'
                        }}>
                             <p className="text-muted small mt-2">SCREEN THIS WAY</p>
                        </div>
                    </div>
                    {renderSeatGrid()}
                </div>
                <div className="modal-footer border-top-0">
                    <div className="me-auto text-muted small d-flex align-items-center gap-2">
                        <Info size={14} /> Only currently confirmed bookings are shown.
                    </div>
                    <Button variant="secondary" onClick={() => setIsSeatModalOpen(false)} className="btn-secondary">Close</Button>
                </div>
            </Modal>

            <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default AdminShowtimes;
