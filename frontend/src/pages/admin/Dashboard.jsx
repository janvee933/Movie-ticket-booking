import React, { useEffect, useState } from 'react';
import { Users, Film, Calendar, DollarSign, TrendingUp, Plus, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Table, Button } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';
import './AdminPages.css';

const AdminDashboard = () => {
    const { adminToken } = useAuth();
    const [stats, setStats] = useState({ users: 0, movies: 0, bookings: 0, revenue: 0, recentBookings: [] });
    const [revenueHistory, setRevenueHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const token = adminToken || localStorage.getItem('admin_token');
                
                // Fetch basic stats
                const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }

                // Fetch chart data
                const revRes = await fetch(`${API_URL}/api/admin/revenue-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (revRes.ok) {
                    const data = await revRes.json();
                    setRevenueHistory(data.map(item => ({
                        name: item._id.split('-').slice(2).join('/'), 
                        revenue: item.revenue
                    })));
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, []);

    const COLORS = ['#e50914', '#764ba2', '#fbbf24', '#10B981'];

    if (loading) return <div className="admin-page-container d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
    </div>;

    const summaryCards = [
        { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: '#10B981', trend: '+12.5%' },
        { title: 'Tickets Sold', value: stats.bookings, icon: <BookOpen size={24} />, color: '#3B82F6', trend: '+5.2%' },
        { title: 'Active Movies', value: stats.movies, icon: <Film size={24} />, color: '#8B5CF6', trend: '+2' },
        { title: 'Total Users', value: stats.users, icon: <Users size={24} />, color: '#F59E0B', trend: '+18%' },
    ];

    return (
        <div className="admin-page-container fade-in">
            <div className="admin-header mb-4">
                <div>
                    <h1 className="admin-title">Dashboard Overview</h1>
                    <p className="text-muted">Welcome back, here's what's happening today.</p>
                </div>
                <div className="d-flex gap-2">
                    <Button as={Link} to="/admin/reports" variant="outline-light" className="btn-glass">
                        <TrendingUp size={18} className="me-2" /> View Reports
                    </Button>
                    <Button as={Link} to="/admin/movies" variant="primary" className="btn-primary-add">
                        <Plus size={18} className="me-2" /> Add Movie
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid mb-4">
                {summaryCards.map((card, index) => (
                    <div className="stat-card" key={index}>
                        <div className="stat-icon-wrapper" style={{ background: `${card.color}15`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{card.title}</span>
                            <div className="d-flex align-items-center gap-2">
                                <h3 className="stat-value">{card.value}</h3>
                                <span className="stat-trend positive">{card.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Row className="g-4 mb-4">
                {/* Revenue Chart */}
                <Col lg={8}>
                    <div className="chart-container-card">
                        <div className="chart-header">
                            <h3 className="chart-title">Revenue Analytics</h3>
                            <span className="text-muted small">Daily revenue trends</span>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={revenueHistory}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#e50914" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ background: '#121217', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#e50914" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Col>

                {/* Quick Stats/Pie */}
                <Col lg={4}>
                    <div className="chart-container-card h-100">
                        <div className="chart-header">
                            <h3 className="chart-title">Sales Distribution</h3>
                        </div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Hollywood', value: 45 },
                                            { name: 'Bollywood', value: 35 },
                                            { name: 'Tollywood', value: 20 },
                                        ]}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {[0,1,2].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2">
                            {['Hollywood', 'Bollywood', 'Tollywood'].map((cat, i) => (
                                <div key={cat} className="d-flex align-items-center justify-content-between mb-2 small">
                                    <span className="d-flex align-items-center gap-2">
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }}></span>
                                        {cat}
                                    </span>
                                    <span className="text-white">{(45 - i*10)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Recent Bookings Table */}
                <Col lg={12}>
                    <div className="chart-container-card">
                        <div className="chart-header d-flex justify-content-between align-items-center mb-0">
                            <h3 className="chart-title mb-0">Recent Bookings</h3>
                            <Link to="/admin/bookings" className="btn-text">View All <ArrowRight size={16} /></Link>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table mt-3">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Movie</th>
                                        <th>Seats</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentBookings.map(booking => (
                                        <tr key={booking._id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="user-avatar-mini me-2">{booking.user?.name?.charAt(0) || 'U'}</div>
                                                    <span>{booking.user?.name || 'Guest'}</span>
                                                </div>
                                            </td>
                                            <td><div className="text-white font-medium">{booking.movieTitle || 'Movie'}</div></td>
                                            <td>{booking.seats?.join(', ')}</td>
                                            <td><span className="text-success fw-bold">₹{booking.totalAmount}</span></td>
                                            <td><span className="badge success">Confirmed</span></td>
                                            <td><div className="d-flex align-items-center gap-1 text-muted"><Clock size={14} /> {new Date(booking.createdAt).toLocaleDateString()}</div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
