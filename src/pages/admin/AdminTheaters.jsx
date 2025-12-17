import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, X, MapPin } from 'lucide-react';

const AdminTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', location: '', city: '' });

    const fetchTheaters = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:5000/api/theaters');
            const data = await res.json();
            setTheaters(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, []); // No dependencies needed as setTheaters/setLoading are stable

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTheaters();
    }, [fetchTheaters]);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this theater?')) {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/theaters/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTheaters();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/theaters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(formData)
        });
        setIsModalOpen(false);
        fetchTheaters();
        setFormData({ name: '', location: '', city: '' });
    };

    if (loading) return <div>Loading theaters...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1c23' }}>Theaters</h1>
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add Theater
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {theaters.map(theater => (
                    <div key={theater._id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, color: '#1a1c23' }}>{theater.name}</h3>
                            <button onClick={() => handleDelete(theater._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                            <MapPin size={16} /> {theater.location}, {theater.city}
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#3b82f6' }}>
                            {theater.screens?.length || 0} Screens Available
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: '#1a1c23' }}>Add Theater</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input className="form-input" placeholder="Theater Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input className="form-input" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                            <input className="form-input" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="admin-btn">Cancel</button>
                                <button type="submit" className="admin-btn admin-btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTheaters;
