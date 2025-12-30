import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, MapPin, Edit2, Monitor } from 'lucide-react';

const AdminTheaters = () => {
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
            const res = await fetch('/api/theaters');
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
            const token = localStorage.getItem('token');
            await fetch(`/api/theaters/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTheaters();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Calculate capacity automatically if needed, or let user override
        const theaterData = {
            ...formData,
            screens: formData.screens.map(s => ({
                ...s,
                capacity: s.rows * s.cols // Auto calc capacity based on grid
            }))
        };

        const url = formData._id ? `/api/theaters/${formData._id}` : '/api/theaters';
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

    if (loading) return <div>Loading theaters...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1c23' }}>Theaters & Screens</h1>
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => openModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Theater
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {theaters.map(theater => (
                    <div key={theater._id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, color: '#1a1c23' }}>{theater.name}</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => openModal(theater)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={18} /></button>
                                <button onClick={() => handleDelete(theater._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                            <MapPin size={16} /> {theater.location}, {theater.city}
                        </div>

                        <div style={{ marginTop: '1rem', width: '100%' }}>
                            <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>SCREENS ({theater.screens?.length || 0})</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {theater.screens?.map((screen, idx) => (
                                    <div key={idx} style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Monitor size={14} />
                                        {screen.name} ({screen.rows}x{screen.cols})
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: '#1a1c23' }}>{formData._id ? 'Edit Theater' : 'Add Theater'}</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input className="form-input" placeholder="Theater Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input className="form-input" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                <input className="form-input" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Screens Layout</h3>
                                <button type="button" onClick={addScreen} className="admin-btn" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>+ Add Screen</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {formData.screens.map((screen, index) => (
                                    <div key={index} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#64748b' }}>#{index + 1}</span>
                                            <button type="button" onClick={() => removeScreen(index)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><X size={16} /></button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <input
                                                className="form-input"
                                                placeholder="Screen Name"
                                                value={screen.name}
                                                onChange={(e) => updateScreen(index, 'name', e.target.value)}
                                            />
                                            <select
                                                className="form-input"
                                                value={screen.type}
                                                onChange={(e) => updateScreen(index, 'type', e.target.value)}
                                            >
                                                <option value="Standard">Standard</option>
                                                <option value="IMAX">IMAX</option>
                                                <option value="VIP">VIP</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <label style={{ fontSize: '0.85rem' }}>Rows:</label>
                                            <input
                                                type="number" className="form-input" style={{ width: '60px' }}
                                                value={screen.rows || 8}
                                                onChange={(e) => updateScreen(index, 'rows', parseInt(e.target.value))}
                                            />
                                            <label style={{ fontSize: '0.85rem' }}>Cols:</label>
                                            <input
                                                type="number" className="form-input" style={{ width: '60px' }}
                                                value={screen.cols || 10}
                                                onChange={(e) => updateScreen(index, 'cols', parseInt(e.target.value))}
                                            />
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 'auto' }}>
                                                Capacity: {(screen.rows || 8) * (screen.cols || 10)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn">Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`
                .form-input {
                    padding: 0.6rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    font-size: 0.95rem;
                    outline: none;
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default AdminTheaters;
