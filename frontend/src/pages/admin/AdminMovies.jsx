import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Search, Film, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';
import './AdminPages.css';

const AdminMovies = () => {
    const { adminToken } = useAuth();
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
        imageFile: null,
        description: '',
        trailerUrl: ''
    });

    const categories = ['Hollywood', 'Bollywood', 'Tollywood'];

    const fetchMovies = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/movies`);
            const data = await res.json();
            setMovies(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                const token = adminToken || localStorage.getItem('admin_token');
                const res = await fetch(`${API_URL}/api/movies/${id}`, {
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
        const token = adminToken || localStorage.getItem('admin_token');
        const url = formData._id ? `${API_URL}/api/movies/${formData._id}` : `${API_URL}/api/movies`;
        const method = formData._id ? 'PUT' : 'POST';

        const data = new FormData();
        data.append('title', formData.title);
        data.append('genre', formData.genre);
        data.append('category', formData.category);
        data.append('rating', formData.rating);
        data.append('duration', formData.duration || 0);
        data.append('description', formData.description);
        data.append('trailerUrl', formData.trailerUrl);
        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchMovies();
                setFormData({
                    title: '', genre: '', category: 'Hollywood', rating: 0, image: '', imageFile: null, description: '', trailerUrl: ''
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

    if (loading) return <div className="admin-page-container">Loading movies...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">Manage Movies</h1>
                <button
                    className="btn-primary-add"
                    onClick={() => {
                        setFormData({
                            title: '', genre: '', category: 'Hollywood', rating: 0, image: '', description: '', trailerUrl: ''
                        });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} /> Add New Movie
                </button>
            </div>

            <div className="admin-toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search movies by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Poster</th>
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
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                                    />
                                </td>
                                <td>
                                    <div style={{ fontWeight: '600' }}>{movie.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{movie.duration} mins</div>
                                </td>
                                <td><span className="badge primary">{movie.category}</span></td>
                                <td>{movie.genre}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                        <span>{movie.rating}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEditModal(movie)} className="btn-icon edit" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(movie._id)} className="btn-icon delete" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredMovies.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Film size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No movies found matching your search.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{formData._id ? 'Edit Movie' : 'Add New Movie'}</h2>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Movie Title</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Inception"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-grid two-col">
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select
                                                className="form-select"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Genre</label>
                                            <input
                                                className="form-input"
                                                placeholder="e.g. Sci-Fi, Action"
                                                value={formData.genre}
                                                onChange={e => setFormData({ ...formData, genre: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-grid two-col">
                                        <div className="form-group">
                                            <label className="form-label">Rating (0-10)</label>
                                            <input
                                                className="form-input"
                                                type="number" step="0.1" max="10"
                                                value={formData.rating}
                                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Duration (mins)</label>
                                            <input
                                                className="form-input"
                                                type="number"
                                                value={formData.duration || ''}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Poster Image</label>
                                        <input
                                            type="file"
                                            className="form-input"
                                            accept="image/*"
                                            onChange={e => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                            required={!formData._id}
                                        />
                                        {formData.image && typeof formData.image === 'string' && (
                                            <small style={{ color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>
                                                Current: {formData.image.split('/').pop()}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Trailer Link (Embed URL)</label>
                                        <input
                                            className="form-input"
                                            placeholder="https://www.youtube.com/embed/..."
                                            value={formData.trailerUrl}
                                            onChange={e => setFormData({ ...formData, trailerUrl: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-textarea"
                                            placeholder="Movie synopsis..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-submit">Save Movie</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMovies;
