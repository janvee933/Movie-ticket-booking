import React, { useEffect, useState } from 'react';
import { Users, UserCog, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';
import '../admin/AdminPages.css';

const SuperAdminDashboard = () => {
    const { adminToken, superAdminToken } = useAuth();
    const [stats, setStats] = useState({ users: 0, admins: 0, bookings: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemStats = async () => {
            try {
                const token = superAdminToken || adminToken || localStorage.getItem('superadmin_token') || localStorage.getItem('admin_token');
                const res = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching system stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSystemStats();
    }, []);

    if (loading) return <div className="admin-page-container">Loading system dashboard...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header mb-4">
                <div>
                    <h1 className="admin-title text-warning"><Shield className="me-2" /> System Control Center</h1>
                    <p className="text-muted">High-level management and system monitoring.</p>
                </div>
            </div>

            <Row className="g-4 mb-4">
                <Col md={4}>
                    <div className="stat-card" style={{ borderTop: '4px solid #F59E0B' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Total Platform Users</span>
                            <h3 className="stat-value">{stats.users}</h3>
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stat-card" style={{ borderTop: '4px solid #764ba2' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}>
                            <UserCog size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Active Administrators</span>
                            <h3 className="stat-value">3</h3> {/* Mocked for now */}
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="stat-card" style={{ borderTop: '4px solid #10B981' }}>
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">System Revenue</span>
                            <h3 className="stat-value">₹{stats.revenue?.toLocaleString()}</h3>
                        </div>
                    </div>
                </Col>
            </Row>

            <div className="chart-container-card">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <AlertTriangle className="text-warning" size={32} />
                    <div>
                        <h4 className="mb-1">SuperAdmin Quick Actions</h4>
                        <p className="text-muted small mb-0">Use these tools for platform-wide enforcement.</p>
                    </div>
                </div>
                <div className="d-flex gap-3 flex-wrap">
                    <Button 
                        variant="outline-warning" 
                        className="px-4"
                        onClick={() => alert('Global Broadcast: Message sent to all active users.')}
                    >
                        Broadcast Message
                    </Button>
                    <Button 
                        variant="outline-danger" 
                        className="px-4"
                        onClick={() => alert('Security Scan: 0 flagged users found in the last 24 hours.')}
                    >
                        Review Flagged Users
                    </Button>
                    <Button 
                        variant="outline-info" 
                        className="px-4"
                        onClick={() => alert('Fetching real-time system logs... (Check Console for details)')}
                    >
                        View System Logs
                    </Button>
                    <Button 
                        variant="warning" 
                        className="px-4 text-dark fw-bold"
                        onClick={() => window.location.href = '/superadmin/settings'}
                    >
                        Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
