import React from 'react';
import { Settings, Shield, Globe, Bell, Database, Lock, DollarSign } from 'lucide-react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import './AdminPages.css';

const SuperAdminSettings = () => {
    return (
        <div className="admin-page-container">
            <div className="admin-header mb-4">
                <div>
                    <h1 className="admin-title text-warning"><Settings className="me-2" /> System Settings</h1>
                    <p className="text-muted">Global configuration for the entire platform.</p>
                </div>
            </div>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="bg-dark border-secondary text-white mb-4">
                        <Card.Header className="border-secondary bg-transparent py-3">
                            <h5 className="mb-0"><DollarSign size={18} className="me-2 text-success" /> Global Pricing & Tax Control</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>GST Rate (%)</Form.Label>
                                            <Form.Control type="number" defaultValue="18" className="bg-dark text-white border-secondary" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Service Fee (₹ per ticket)</Form.Label>
                                            <Form.Control type="number" defaultValue="30" className="bg-dark text-white border-secondary" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Check 
                                        type="checkbox"
                                        id="dynamic-pricing"
                                        label="Enable Dynamic Pricing (Peak Hours)"
                                        defaultChecked
                                    />
                                </Form.Group>
                                <Button 
                                    variant="success" 
                                    className="px-4"
                                    onClick={() => alert('Financial records updated! New Tax and Service Fee rates are now active.')}
                                >
                                    Update Financials
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="bg-dark border-secondary text-white mb-4">
                        <Card.Header className="border-secondary bg-transparent py-3">
                            <h5 className="mb-0"><Shield size={18} className="me-2 text-primary" /> Roles & System Permissions</h5>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted small mb-3">Define what each role can perform across the system.</p>
                            <div className="permission-item d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <span>Admins can create Theaters</span>
                                <Form.Check type="switch" defaultChecked />
                            </div>
                            <div className="permission-item d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <span>Admins can view Global Reports</span>
                                <Form.Check type="switch" />
                            </div>
                            <div className="permission-item d-flex justify-content-between align-items-center mb-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <span>Allow Guest Bookings (No Login)</span>
                                <Form.Check type="switch" />
                            </div>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="mt-3"
                                onClick={() => alert('System Permissions saved successfully.')}
                            >
                                Save Permissions
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="bg-dark border-secondary text-white">
                        <Card.Header className="border-secondary bg-transparent py-3">
                            <h5 className="mb-0"><Lock size={18} className="me-2 text-warning" /> Security & API</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>JWT Secret Rotation (Days)</Form.Label>
                                    <Form.Control type="number" defaultValue="30" className="bg-dark text-white border-secondary" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Check 
                                        type="checkbox"
                                        id="force-2fa"
                                        label="Force 2FA for all Administrators"
                                        defaultChecked
                                    />
                                </Form.Group>
                                <Button 
                                    variant="outline-warning"
                                    onClick={() => alert('Security Keys Rotated: All active admin sessions will require re-authentication.')}
                                >
                                    Regenerate API Keys
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="bg-dark border-secondary text-white mb-4">
                        <Card.Header className="border-secondary bg-transparent">
                            <h5 className="mb-0 small text-uppercase">System Health</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>API Status</span>
                                <span className="text-success">● Healthy</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Database</span>
                                <span className="text-success">● Connected</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Storage</span>
                                <span className="text-info">82% Used</span>
                            </div>
                        </Card.Body>
                    </Card>

                    <div className="d-grid gap-2">
                        <Button 
                            variant="outline-danger"
                            onClick={() => alert('System Cache Flushed: Platform speed optimized.')}
                        >
                            <Database size={16} className="me-2" /> Flush System Cache
                        </Button>
                        <Button 
                            variant="outline-info"
                            onClick={() => alert('System Broadcast: Maintenance alert sent to all users.')}
                        >
                            <Bell size={16} className="me-2" /> Send System Broadcast
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default SuperAdminSettings;
