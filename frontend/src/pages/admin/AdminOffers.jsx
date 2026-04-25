import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Search, Tag, Percent } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminOffers = () => {
    const { adminToken } = useAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        code: '',
        validity: '',
        image: '',
        color: '#ef4444' // Default red
    });

    const fetchOffers = useCallback(async () => {
        try {
            const res = await fetch('/api/offers?all=true'); // Fetch all including inactive if needed
            const data = await res.json();
            setOffers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching offers:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                const token = adminToken || localStorage.getItem('admin_token');
                const res = await fetch(`/api/offers/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchOffers();
                }
            } catch (error) {
                console.error('Error deleting offer:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = adminToken || localStorage.getItem('admin_token');
        const url = formData._id ? `/api/offers/${formData._id}` : '/api/offers';
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
                fetchOffers();
                setFormData({
                    title: '', description: '', code: '', validity: '', image: '', color: '#ef4444'
                });
            }
        } catch (error) {
            console.error('Error saving offer:', error);
        }
    };

    const openEditModal = (offer) => {
        setFormData(offer);
        setIsModalOpen(true);
    };

    const filteredOffers = offers.filter(offer =>
        offer.title.toLowerCase().includes(search.toLowerCase()) ||
        offer.code.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-page-container">Loading offers...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">Offers & Promotions</h1>
                <button
                    className="btn-primary-add"
                    onClick={() => {
                        setFormData({ title: '', description: '', code: '', validity: '', image: '', color: '#ef4444' });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} /> New Offer
                </button>
            </div>

            <div className="admin-toolbar">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search offers by title or promo code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Promo</th>
                            <th>Details</th>
                            <th>Code</th>
                            <th>Validity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOffers.map(offer => (
                            <tr key={offer._id}>
                                <td>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        background: offer.color || '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}>
                                        {offer.image ? (
                                            <img src={offer.image} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Percent color="white" size={24} />
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: '600', fontSize: '1.05rem', color: 'white' }}>{offer.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{offer.description}</div>
                                </td>
                                <td>
                                    <span style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '6px',
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px',
                                        border: '1px dashed rgba(255, 255, 255, 0.3)',
                                        color: '#fbbf24'
                                    }}>
                                        {offer.code}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                        <Tag size={14} className="text-muted" />
                                        <span>{offer.validity}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEditModal(offer)} className="btn-icon edit" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(offer._id)} className="btn-icon delete" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOffers.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        <Tag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>No active offers found.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{formData._id ? 'Edit Offer' : 'Create New Offer'}</h2>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group mb-4">
                                    <label className="form-label">Offer Title</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g., Summer Blockbuster Sale"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-grid two-col mb-4">
                                    <div className="form-group">
                                        <label className="form-label">Promo Code</label>
                                        <input
                                            className="form-input"
                                            placeholder="SUMMER50"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            required
                                            style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Theme Color</label>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '0.2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <input
                                                type="color"
                                                value={formData.color}
                                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                                                style={{ border: 'none', background: 'none', height: '36px', width: '100%', cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Details about the discount..."
                                        rows="3"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        style={{ minHeight: '80px' }}
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label">Validity Text</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Valid until 30th June"
                                        value={formData.validity}
                                        onChange={e => setFormData({ ...formData, validity: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image URL (Optional)</label>
                                    <input
                                        className="form-input"
                                        placeholder="https://..."
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-submit">Save Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
