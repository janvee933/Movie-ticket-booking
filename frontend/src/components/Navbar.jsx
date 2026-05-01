import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, User, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navbar as BsNavbar, Nav, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { 
        isAuthenticated, 
        isAdminAuthenticated, 
        isSuperAdminAuthenticated,
        user, 
        admin, 
        superAdmin,
        logout 
    } = useAuth();
    
    // UI variables for specific areas
    const currentSuperAdmin = superAdmin;
    const currentAdmin = admin;
    const currentUser = user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <BsNavbar
            expand="lg"
            fixed="top"
            className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
            variant="dark"
        >
            <Container>
                <BsNavbar.Brand as={Link} to="/home" className="logo">
                    <Film className="logo-icon" />
                    <span className="logo-text">Cine<span className="highlight">Ticket</span></span>
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto desktop-nav">
                        <Nav.Link as={NavLink} to="/home">{t('nav.home')}</Nav.Link>
                        <Nav.Link as={NavLink} to="/movies">{t('nav.movies')}</Nav.Link>
                        <Nav.Link as={NavLink} to="/cinemas">{t('nav.cinemas')}</Nav.Link>
                        <Nav.Link as={NavLink} to="/offers">{t('nav.offers')}</Nav.Link>
                    </Nav>

                    <div className="nav-actions d-flex align-items-center gap-3">
                        <button className="icon-btn lang-btn" onClick={toggleLanguage} title="Switch Language">
                            <Globe size={20} />
                            <span className="lang-code ms-1">{i18n.language.toUpperCase()}</span>
                        </button>

                        <Form onSubmit={handleSearchSubmit} className="d-flex search-form">
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder={t('nav.search_placeholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input bg-transparent text-white"
                                />
                                <Button variant="outline-light" type="submit" className="search-btn">
                                    <Search size={18} />
                                </Button>
                            </InputGroup>
                        </Form>

                        {/* Identity section - strictly isolated from Admin status */}

                        {/* Public User Identity - Strictly isolated from Admin status */}
                        {user ? (
                            <div className="nav-actions-auth d-flex align-items-center gap-2">
                                <Link to="/profile" className="icon-btn" title="Profile">
                                    <User size={20} />
                                </Link>
                                <button
                                    className="icon-btn text-danger"
                                    title="Logout"
                                    onClick={() => {
                                        logout('user');
                                        navigate('/login');
                                    }}
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm px-4">
                                Sign In
                            </Link>
                        )}
                    </div>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;
