import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';

const AdminMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        category: 'Hollywood',
        rating: 0,
        image: '',
        description: '',
        trailerUrl: ''
    });

    const categories = ['Hollywood', 'Bollywood', 'Tollywood'];

    const fetchMovies = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/movies');
            const data = await res.json();
            setMovies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMovies();
    }, [fetchMovies]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchMovies();
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = formData._id
            ? `http://localhost:5000/api/movies/${formData._id}`
            : 'http://localhost:5000/api/movies';

        const method = formData._id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchMovies();
                setFormData({
                    title: '',
                    genre: '',
                    category: 'Hollywood',
                    rating: 0,
                    image: '',
                    description: '',
                    trailerUrl: ''
                });
            }
        } catch (error) {
            console.error('Error saving movie:', error);
        }
    };

    const openEditModal = (movie) => {
        setFormData(movie);
        setIsModalOpen(true);
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading movies...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1c23' }}>Movies</h1>
                <button
                    className="admin-btn admin-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {
                        setFormData({
                            title: '', genre: '', category: 'Hollywood', rating: 0, image: '', description: '', trailerUrl: ''
                        });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} /> Add Movie
                </button>
            </div>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
                <Search size={20} color="#64748b" />
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Genre</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovies.map(movie => (
                            <tr key={movie._id}>
                                <td>
                                    <img src={movie.image} alt={movie.title} style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>{movie.title}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: movie.category === 'Hollywood' ? '#e0f2fe' : '#fce7f3',
                                        color: movie.category === 'Hollywood' ? '#0369a1' : '#be185d'
                                    }}>
                                        {movie.category}
                                    </span>
                                </td>
                                <td>{movie.genre}</td>
                                <td>⭐ {movie.rating}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEditModal(movie)} className="admin-btn" style={{ background: '#eff6ff', color: '#3b82f6' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(movie._id)} className="admin-btn" style={{ background: '#fef2f2', color: '#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
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
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#1a1c23' }}>{formData._id ? 'Edit Movie' : 'Add New Movie'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                className="form-input"
                                placeholder="Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <select
                                    className="form-input"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <input
                                    className="form-input"
                                    placeholder="Genre"
                                    value={formData.genre}
                                    onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    className="form-input"
                                    type="number" step="0.1" max="10"
                                    placeholder="Rating"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                />
                                <input
                                    className="form-input"
                                    type="number"
                                    placeholder="Duration (min)"
                                    value={formData.duration || ''}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                />
                            </div>
                            <input
                                className="form-input"
                                placeholder="Image URL (Poster)"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                required
                            />
                            <input
                                className="form-input"
                                placeholder="Trailer URL (Embed Format)"
                                value={formData.trailerUrl}
                                onChange={e => setFormData({ ...formData, trailerUrl: e.target.value })}
                            />
                            <textarea
                                className="form-input"
                                placeholder="Description"
                                rows="4"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn" style={{ background: '#f1f5f9' }}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Save Movie</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`
                .form-input {
                    padding: 0.8rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    border-color: var(--color-primary);
                }
            `}</style>
        </div>
    );
};

export default AdminMovies;
