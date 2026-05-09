import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCcw, Search, Filter, CheckCircle, XCircle, Download, MoreVertical } from 'lucide-react';
import { Row, Col, Card, Badge, Button, Table, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';
import './AdminPages.css';

const SuperAdminPayments = () => {
    const { superAdminToken } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchPayments = async () => {
        try {
            const token = superAdminToken || localStorage.getItem('superadmin_token');
            const res = await fetch(`${API_URL}/api/admin/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setPayments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleRefund = async (bookingId) => {
        if (!window.confirm('Are you sure you want to process a refund for this booking?')) return;
        try {
            const token = superAdminToken || localStorage.getItem('superadmin_token');
            const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/refund`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Refund processed successfully!');
                fetchPayments();
            }
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

    const filteredPayments = payments.filter(p => 
        p.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.movie?.title?.toLowerCase().includes(search.toLowerCase()) ||
        p._id.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-page-container">Loading payment records...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header mb-4">
                <div>
                    <h1 className="admin-title text-success"><CreditCard className="me-2" /> Payment & Refund Control</h1>
                    <p className="text-muted">Global transaction monitoring and refund management.</p>
                </div>
                <Button variant="outline-success" onClick={() => alert('Generating Financial Report... Your download will start shortly (CSV format).')}>
                    <Download size={18} className="me-2" /> Export Financial Report
                </Button>
            </div>

            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="bg-dark border-secondary text-white p-3">
                        <div className="text-muted small">Total Volume</div>
                        <h4 className="mb-0">₹{(payments.reduce((acc, p) => acc + (p.totalPrice || 0), 0)).toLocaleString()}</h4>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark border-secondary text-white p-3">
                        <div className="text-muted small">Refunded</div>
                        <h4 className="mb-0 text-danger">₹{(payments.filter(p => p.status === 'refunded').reduce((acc, p) => acc + (p.totalPrice || 0), 0)).toLocaleString()}</h4>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark border-secondary text-white p-3">
                        <div className="text-muted small">Pending UPI</div>
                        <h4 className="mb-0 text-warning">12</h4>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark border-secondary text-white p-3">
                        <div className="text-muted small">Success Rate</div>
                        <h4 className="mb-0 text-success">98.4%</h4>
                    </Card>
                </Col>
            </Row>

            <div className="admin-toolbar mb-4">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by Transaction ID, User or Movie..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <Table className="data-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>User</th>
                            <th>Movie / Theater</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map(p => (
                            <tr key={p._id}>
                                <td className="small text-muted">{p._id.substring(0, 10)}...</td>
                                <td>
                                    <div className="fw-bold">{p.user?.name}</div>
                                    <div className="text-muted smaller">{p.user?.email}</div>
                                </td>
                                <td>
                                    <div>{p.movie?.title}</div>
                                    <div className="text-muted small">{p.theater?.name}</div>
                                </td>
                                <td><span className="fw-bold text-success">₹{p.totalPrice}</span></td>
                                <td><Badge bg="secondary" className="text-uppercase">{p.paymentMethod || 'UPI'}</Badge></td>
                                <td>
                                    <Badge bg={p.status === 'confirmed' ? 'success' : p.status === 'refunded' ? 'danger' : 'warning'}>
                                        {p.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Dropdown align="end">
                                        <Dropdown.Toggle variant="link" className="text-white p-0 no-caret">
                                            <MoreVertical size={18} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu variant="dark">
                                            <Dropdown.Item onClick={() => handleRefund(p._id)} disabled={p.status === 'refunded'}>
                                                <RefreshCcw size={14} className="me-2" /> Process Refund
                                            </Dropdown.Item>
                                            <Dropdown.Item className="text-danger">
                                                <XCircle size={14} className="me-2" /> Cancel Transaction
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default SuperAdminPayments;
