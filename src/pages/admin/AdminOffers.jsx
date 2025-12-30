import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Search, Tag } from 'lucide-react';

const AdminOffers = () => {
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
        color: '#ef4444'
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
                const token = localStorage.getItem('token');
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
        const token = localStorage.getItem('token');
        const url = formData._id
            ? `/api/offers/${formData._id}`
            : '/api/offers';

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

    if (loading) return <div>Loading offers...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1c23' }}>Offers & Promos</h1>
                <button
                    className="admin-btn admin-btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {
                        setFormData({
                            title: '', description: '', code: '', validity: '', image: '', color: '#ef4444'
                        });
                        setIsModalOpen(true);
                    }}
                >
                    <Plus size={20} /> Add Offer
                </button>
            </div>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8f0' }}>
                <Search size={20} color="#64748b" />
                <input
                    type="text"
                    placeholder="Search offers..."
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
                            <th>Code</th>
                            <th>Validity</th>
                            <th>Color</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOffers.map(offer => (
                            <tr key={offer._id}>
                                <td>
                                    <img src={offer.image} alt={offer.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>
                                    <div style={{ fontWeight: '500' }}>{offer.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{offer.description}</div>
                                </td>
                                <td>
                                    <span style={{ background: '#fef3c7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', color: '#d97706', fontWeight: 'bold' }}>
                                        {offer.code}
                                    </span>
                                </td>
                                <td>{offer.validity}</td>
                                <td>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: offer.color }}></div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => openEditModal(offer)} className="admin-btn" style={{ background: '#eff6ff', color: '#3b82f6' }}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(offer._id)} className="admin-btn" style={{ background: '#fef2f2', color: '#ef4444' }}><Trash2 size={16} /></button>
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
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2>{formData._id ? 'Edit Offer' : 'Add New Offer'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                className="form-input"
                                placeholder="Title (e.g., Summer Sale)"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="form-input"
                                placeholder="Description"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    className="form-input"
                                    placeholder="Code (e.g., SALE50)"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    required
                                />
                                <input
                                    className="form-input"
                                    placeholder="Validity (e.g., Valid all June)"
                                    value={formData.validity}
                                    onChange={e => setFormData({ ...formData, validity: e.target.value })}
                                    required
                                />
                            </div>
                            <input
                                className="form-input"
                                placeholder="Image URL"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label>Accent Color:</label>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    style={{ height: '40px', width: '60px', padding: 0, border: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn" style={{ background: '#f1f5f9' }}>Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Save Offer</button>
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

export default AdminOffers;
