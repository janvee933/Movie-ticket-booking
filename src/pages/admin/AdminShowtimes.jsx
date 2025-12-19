import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Calendar } from 'lucide-react';

const AdminShowtimes = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        movie: '',
        theater: '',
        screen: 'Screen 1',
        startTime: '',
        price: '',
        date: '' // Helper for frontend
    });

    const fetchData = useCallback(async () => {
        const [showtimesRes, moviesRes, theatersRes] = await Promise.all([
            fetch('/api/showtimes'),
            fetch('/api/movies'),
            fetch('/api/theaters')
        ]);

        setShowtimes(await showtimesRes.json());
        setMovies(await moviesRes.json());
        setTheaters(await theatersRes.json());
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Combine date and time
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
            const token = localStorage.getItem('token');
            await fetch(`/api/showtimes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1c23' }}>Showtimes</h1>
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Showtime
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Movie</th>
                            <th>Theater</th>
                            <th>Screen</th>
                            <th>Time</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showtimes.map(show => (
                            <tr key={show._id}>
                                <td>{show.movie?.title || 'Unknown Movie'}</td>
                                <td>{show.theater?.name || 'Unknown Theater'}</td>
                                <td>{show.screen}</td>
                                <td>{new Date(show.startTime).toLocaleString()}</td>
                                <td>₹{show.price}</td>
                                <td>
                                    <button onClick={() => handleDelete(show._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '500px' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#1a1c23' }}>Schedule Showtime</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <select className="form-input" value={formData.movie} onChange={e => setFormData({ ...formData, movie: e.target.value })} required>
                                <option value="">Select Movie</option>
                                {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                            </select>

                            <select className="form-input" value={formData.theater} onChange={e => setFormData({ ...formData, theater: e.target.value })} required>
                                <option value="">Select Theater</option>
                                {theaters.map(t => <option key={t._id} value={t._id}>{t.name} ({t.city})</option>)}
                            </select>

                            <select className="form-input" value={formData.screen} onChange={e => setFormData({ ...formData, screen: e.target.value })} required>
                                <option value="Screen 1">Screen 1</option>
                                <option value="Screen 2">Screen 2</option>
                                <option value="IMAX">IMAX</option>
                            </select>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.startTime}
                                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    required
                                />
                            </div>

                            <input
                                type="number"
                                className="form-input"
                                placeholder="Price (₹)"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn">Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Create Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminShowtimes;
