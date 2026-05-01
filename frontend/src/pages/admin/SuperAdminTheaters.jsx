import React, { useState, useEffect } from 'react';
import { Monitor, UserPlus, Shield, MapPin, Search, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Row, Col, Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const SuperAdminTheaters = () => {
    const { superAdminToken } = useAuth();
    const [theaters, setTheaters] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState('');
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [theaterSchedule, setTheaterSchedule] = useState([]);

    const fetchSchedule = async (theaterId) => {
        try {
            const res = await fetch(`/api/showtimes?theater=${theaterId}`);
            const data = await res.json();
            setTheaterSchedule(data);
            setIsScheduleModalOpen(true);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const fetchData = async () => {
        try {
            const token = superAdminToken || localStorage.getItem('superadmin_token');
            const [theatersRes, usersRes] = await Promise.all([
                fetch('/api/theaters', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const theatersData = await theatersRes.json();
            const usersData = await usersRes.json();

            setTheaters(theatersData);
            setAdmins(usersData.filter(u => u.role === 'admin' || u.role === 'superadmin'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching theater management data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignOwner = async () => {
        if (!selectedAdminId) return;
        try {
            const token = superAdminToken || localStorage.getItem('superadmin_token');
            const res = await fetch(`/api/theaters/${selectedTheater._id}/owner`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ownerId: selectedAdminId })
            });

            if (res.ok) {
                setIsAssignModalOpen(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error assigning owner:', error);
        }
    };

    const filteredTheaters = theaters.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.city.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="admin-page-container">Loading theater oversight...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-header mb-4">
                <div>
                    <h1 className="admin-title text-warning"><Monitor className="me-2" /> Global Theater Oversight</h1>
                    <p className="text-muted">Monitor all theaters across the platform and assign management roles.</p>
                </div>
            </div>

            <div className="admin-toolbar mb-4">
                <div className="search-bar">
                    <Search size={20} />
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search by theater name or city..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Row className="g-4">
                {filteredTheaters.map(theater => {
                    const owner = admins.find(a => a._id === theater.owner);
                    return (
                        <Col lg={6} key={theater._id}>
                            <Card className="bg-dark border-secondary text-white h-100 theater-card-global">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h4 className="mb-1">{theater.name}</h4>
                                            <div className="text-muted small d-flex align-items-center gap-1">
                                                <MapPin size={14} /> {theater.location}, {theater.city}
                                            </div>
                                        </div>
                                        <Badge bg={theater.owner ? 'success' : 'secondary'} className="px-3 py-2">
                                            {theater.owner ? 'Managed' : 'Unassigned'}
                                        </Badge>
                                    </div>

                                    <div className="system-info-box mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <Shield size={18} className="text-warning" />
                                                <span className="small">Current Admin:</span>
                                            </div>
                                            <span className="fw-bold">{owner ? owner.name : 'Not Assigned'}</span>
                                        </div>
                                        {owner && <div className="text-muted smaller text-end mt-1">{owner.email}</div>}
                                    </div>

                                    <div className="row g-2 mb-4">
                                        <div className="col-6">
                                            <div className="mini-stat-item">
                                                <span className="label">Screens</span>
                                                <span className="value">{theater.screens?.length || 0}</span>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mini-stat-item">
                                                <span className="label">Status</span>
                                                <span className="value text-success">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 mt-auto">
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="w-100 text-dark fw-bold"
                                            onClick={() => {
                                                setSelectedTheater(theater);
                                                setSelectedAdminId(theater.owner || '');
                                                setIsAssignModalOpen(true);
                                            }}
                                        >
                                            <UserPlus size={16} className="me-1" /> Enroll Admin
                                        </Button>
                                        <Button 
                                            variant="outline-light" 
                                            size="sm" 
                                            className="w-100"
                                            onClick={() => {
                                                setSelectedTheater(theater);
                                                fetchSchedule(theater._id);
                                            }}
                                        >
                                            <Calendar size={16} className="me-1" /> View Schedule
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Enrollment Modal */}
            <Modal show={isAssignModalOpen} onHide={() => setIsAssignModalOpen(false)} centered contentClassName="bg-dark border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title>Enroll Administrator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small mb-4">Assign an administrator to manage <strong>{selectedTheater?.name}</strong>. They will have full control over showtimes and bookings for this theater.</p>
                    <Form.Group>
                        <Form.Label>Select Admin Account</Form.Label>
                        <Form.Select 
                            className="bg-dark text-white border-secondary"
                            value={selectedAdminId}
                            onChange={(e) => setSelectedAdminId(e.target.value)}
                        >
                            <option value="">-- Select Administrator --</option>
                            {admins.map(admin => (
                                <option key={admin._id} value={admin._id}>
                                    {admin.name} ({admin.email})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                    <Button variant="warning" className="text-dark fw-bold" onClick={handleAssignOwner}>
                        Confirm Enrollment
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Schedule Modal */}
            <Modal show={isScheduleModalOpen} onHide={() => setIsScheduleModalOpen(false)} centered size="lg" contentClassName="bg-dark border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title>Theater Schedule - {selectedTheater?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {theaterSchedule.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-dark table-hover border-secondary mb-0">
                                <thead>
                                    <tr>
                                        <th>Movie</th>
                                        <th>Screen</th>
                                        <th>Date / Time</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {theaterSchedule.map(show => (
                                        <tr key={show._id}>
                                            <td><span className="text-warning fw-bold">{show.movie?.title}</span></td>
                                            <td>{show.screen}</td>
                                            <td>
                                                <div className="small">{new Date(show.startTime).toLocaleDateString()}</div>
                                                <div className="text-muted smaller">{new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="text-success">₹{show.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <Clock size={48} className="text-muted mb-3" />
                            <h5>No active showtimes found.</h5>
                            <p className="text-muted small">This theater currently has no scheduled movies.</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={() => setIsScheduleModalOpen(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
            <style>{`
                .theater-card-global {
                    transition: transform 0.2s;
                }
                .theater-card-global:hover {
                    transform: translateY(-5px);
                }
                .mini-stat-item {
                    background: rgba(255,255,255,0.03);
                    padding: 10px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                }
                .mini-stat-item .label {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    text-transform: uppercase;
                }
                .mini-stat-item .value {
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                .smaller { font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default SuperAdminTheaters;
