import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, Menu, X, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
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

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-content">
                <Link to="/home" className="logo">
                    <Film className="logo-icon" />
                    <span className="logo-text">Cine<span className="highlight">Ticket</span></span>
                </Link>

                <div className="desktop-nav">
                    <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
                    <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Movies</NavLink>
                    <NavLink to="/cinemas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Cinemas</NavLink>
                    <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Offers</NavLink>
                </div>

                <div className="nav-actions">
                    <div className={`search-bar ${isSearchOpen ? 'active' : ''}`}>
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Search movies..."
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
                        <Link to="/login" className="btn btn-primary login-btn">Sign In</Link>
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
                    <NavLink to="/home" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/movies" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Movies</NavLink>
                    <NavLink to="/cinemas" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Cinemas</NavLink>
                    <NavLink to="/offers" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Offers</NavLink>
                    <Link to="/profile" className="mobile-link highlight" onClick={() => setIsMobileMenuOpen(false)}>
                        {user ? 'My Account' : 'Sign In'}
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
