import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, BookOpen, Film, TrendingUp, Download, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const AdminReports = () => {
    const { adminToken, superAdminToken } = useAuth();
    const [revenueData, setRevenueData] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, avgTicketPrice: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const token = superAdminToken || adminToken || localStorage.getItem('superadmin_token') || localStorage.getItem('admin_token');
                // Fetch chart data
                const revRes = await fetch('/api/admin/revenue-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const revData = await revRes.json();
                setRevenueData(revData.map(item => ({
                    date: item._id,
                    revenue: item.revenue,
                    bookings: item.bookings
                })));

                // Fetch general stats for consistency
                const statsRes = await fetch('/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const statsData = await statsRes.json();
                setStats({
                    totalRevenue: statsData.revenue,
                    totalBookings: statsData.bookings,
                    avgTicketPrice: statsData.bookings > 0 ? Math.round(statsData.revenue / statsData.bookings) : 0
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching report data:', error);
                setLoading(false);
            }
        };

        fetchReportData();
    }, []);

    if (loading) return <div className="admin-page-container">Loading reports...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Financial Reports & Analytics</h1>
                    <p className="text-muted">Track your business performance and revenue trends</p>
                </div>
                <button className="btn-primary-add" style={{ background: 'var(--color-secondary)' }}>
                    <Download size={20} /> Export PDF
                </button>
            </div>

            {/* Summary Cards */}
            <div className="stats-grid mb-5">
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Revenue</span>
                        <h3 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                        <BookOpen size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Bookings</span>
                        <h3 className="stat-value">{stats.totalBookings}</h3>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Avg. Booking Value</span>
                        <h3 className="stat-value">₹{stats.avgTicketPrice}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="report-charts-grid">
                <div className="chart-container-card full-width">
                    <div className="chart-header">
                        <h3 className="chart-title">Revenue Trends (Last 7 Days)</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className="badge info">Daily</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e50914" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                />
                                <YAxis 
                                    stroke="#9ca3af" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => `₹${val}`}
                                />
                                <Tooltip 
                                    contentStyle={{ background: '#1e1e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#e50914" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
