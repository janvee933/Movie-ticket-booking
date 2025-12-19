import React, { useEffect, useState } from 'react';
import { Users, Film, Calendar, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, movies: 0, bookings: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.revenue}`, icon: <DollarSign size={24} />, color: '#10B981' },
        { title: 'Total Bookings', value: stats.bookings, icon: <Calendar size={24} />, color: '#3B82F6' },
        { title: 'Total Movies', value: stats.movies, icon: <Film size={24} />, color: '#8B5CF6' },
        { title: 'Total Users', value: stats.users, icon: <Users size={24} />, color: '#F59E0B' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: '#1a1c23' }}>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card, index) => (
                    <div key={index} className="stat-card">
                        <div style={{ padding: '1rem', borderRadius: '50%', background: `${card.color}20`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{card.title}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
