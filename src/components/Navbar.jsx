import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, Menu, X, User, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/home" className="logo">
                    <Film className="logo-icon" />
                    <span className="logo-text">Cine<span className="highlight">Ticket</span></span>
                </Link>

                <div className="desktop-nav">
                    <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('nav.home')}</NavLink>
                    <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('nav.movies')}</NavLink>
                    <NavLink to="/cinemas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('nav.cinemas')}</NavLink>
                    <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('nav.offers')}</NavLink>
                </div>

                <div className="nav-actions">
                    <button className="icon-btn lang-btn" onClick={toggleLanguage} title="Switch Language">
                        <Globe size={20} />
                        <span className="lang-code">{i18n.language.toUpperCase()}</span>
                    </button>

                    <div className={`search-bar ${isSearchOpen ? 'active' : ''}`}>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder={t('nav.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </form>
                        <button className="icon-btn" onClick={() => {
                            if (isSearchOpen && searchQuery) {
                                handleSearchSubmit({ preventDefault: () => { } });
                            } else {
                                setIsSearchOpen(!isSearchOpen);
                            }
                        }}>
                            <Search size={20} />
                        </button>
                    </div>

                    {user ? (
                        <Link to="/profile" className="profile-btn">
                            <User size={20} />
                            <span className="profile-name">{user.name.split(' ')[0]}</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary login-btn">{t('nav.signin')}</Link>
                    )}

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <NavLink to="/home" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</NavLink>
                    <NavLink to="/movies" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.movies')}</NavLink>
                    <NavLink to="/cinemas" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.cinemas')}</NavLink>
                    <NavLink to="/offers" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.offers')}</NavLink>
                    <div className="mobile-link" onClick={toggleLanguage} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={16} /> Switch to {i18n.language === 'en' ? 'Hindi' : 'English'}
                    </div>
                    <Link to="/profile" className="mobile-link highlight" onClick={() => setIsMobileMenuOpen(false)}>
                        {user ? t('nav.myaccount') : t('nav.signin')}
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
