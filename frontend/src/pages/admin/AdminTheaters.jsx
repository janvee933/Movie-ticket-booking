import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, MapPin, Edit2, Monitor, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';
import './AdminPages.css';

const AdminTheaters = () => {
    const { adminToken } = useAuth();
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Enhanced form data including screens
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        city: '',
        screens: [] // [{ name, type, capacity, rows, cols }]
    });

    const fetchTheaters = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/theaters`);
            const data = await res.json();
            setTheaters(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTheaters();
    }, [fetchTheaters]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this theater?')) {
            const token = adminToken || localStorage.getItem('admin_token');
            await fetch(`${API_URL}/api/theaters/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTheaters();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = adminToken || localStorage.getItem('admin_token');

        // Calculate capacity automatically if needed, or let user override
        const theaterData = {
            ...formData,
            screens: formData.screens.map(s => ({
                ...s,
                capacity: s.rows * s.cols // Auto calc capacity based on grid
            }))
        };

        const url = formData._id ? `${API_URL}/api/theaters/${formData._id}` : `${API_URL}/api/theaters`;
        const method = formData._id ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(theaterData)
        });
        setIsModalOpen(false);
        fetchTheaters();
    };

    const openModal = (theater = null) => {
        if (theater) {
            setFormData(theater);
        } else {
            setFormData({ name: '', location: '', city: '', screens: [] });
        }
        setIsModalOpen(true);
    };

    const addScreen = () => {
        setFormData({
            ...formData,
            screens: [...formData.screens, { name: `Screen ${formData.screens.length + 1}`, type: 'Standard', rows: 8, cols: 10 }]
        });
    };

    const removeScreen = (index) => {
        const newScreens = [...formData.screens];
        newScreens.splice(index, 1);
        setFormData({ ...formData, screens: newScreens });
    };

    const updateScreen = (index, field, value) => {
        const newScreens = [...formData.screens];
        newScreens[index][field] = value;
        setFormData({ ...formData, screens: newScreens });
    };

    if (loading) return <div className="admin-page-container">Loading theaters...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1 className="admin-title">Theaters & Screens</h1>
                <button
                    className="btn-primary-add"
                    onClick={() => openModal()}
                >
                    <Plus size={20} /> Add Theater
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {theaters.map(theater => (
                    <div key={theater._id} className="data-table-container" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{theater.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                                    <MapPin size={14} /> {theater.location}, {theater.city}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openModal(theater)} className="btn-icon edit" title="Edit Theater">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(theater._id)} className="btn-icon delete" title="Delete Theater">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.8rem', letterSpacing: '1px' }}>
                                Screens ({theater.screens?.length || 0})
                            </h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {theater.screens?.map((screen, idx) => (
                                    <div key={idx} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '0.5rem 0.8rem',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: '#e2e8f0',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <Monitor size={14} className="text-primary" />
                                        <span>{screen.name}</span>
                                        <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>({screen.rows}x{screen.cols})</span>
                                    </div>
                                ))}
                                {(!theater.screens || theater.screens.length === 0) && (
                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No screens added</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">{formData._id ? 'Edit Theater' : 'Add New Theater'}</h2>
                            <button className="btn-close" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group mb-4">
                                    <label className="form-label">Theater Name</label>
                                    <input
                                        className="form-input"
                                        placeholder="Miniplex Cinemas"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-grid two-col mb-4">
                                    <div className="form-group">
                                        <label className="form-label">Location (Area)</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Downtown"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            className="form-input"
                                            placeholder="e.g. Mumbai"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <LayoutGrid size={18} /> Screens Layout
                                        </h3>
                                        <button type="button" onClick={addScreen} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                            + Add Screen
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                        {formData.screens.map((screen, index) => (
                                            <div key={index} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-primary)' }}>Screen #{index + 1}</span>
                                                    <button type="button" onClick={() => removeScreen(index)} className="btn-close" style={{ padding: '2px' }}>
                                                        <X size={16} color="#ef4444" />
                                                    </button>
                                                </div>
                                                <div className="form-grid two-col" style={{ marginBottom: '0.8rem' }}>
                                                    <input
                                                        className="form-input"
                                                        placeholder="Screen Name"
                                                        value={screen.name}
                                                        onChange={(e) => updateScreen(index, 'name', e.target.value)}
                                                    />
                                                    <select
                                                        className="form-select"
                                                        value={screen.type}
                                                        onChange={(e) => updateScreen(index, 'type', e.target.value)}
                                                    >
                                                        <option value="Standard">Standard</option>
                                                        <option value="IMAX">IMAX</option>
                                                        <option value="VIP">VIP</option>
                                                    </select>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Rows</label>
                                                        <input
                                                            type="number" className="form-input" style={{ width: '70px', padding: '0.5rem' }}
                                                            value={screen.rows || 8}
                                                            onChange={(e) => updateScreen(index, 'rows', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Cols</label>
                                                        <input
                                                            type="number" className="form-input" style={{ width: '70px', padding: '0.5rem' }}
                                                            value={screen.cols || 10}
                                                            onChange={(e) => updateScreen(index, 'cols', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                                        Capacity: <strong style={{ color: 'white' }}>{(screen.rows || 8) * (screen.cols || 10)}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {formData.screens.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                                No screens added yet. Click "+ Add Screen" to configure layout.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-submit">Save Theater</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTheaters;
