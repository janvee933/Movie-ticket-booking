import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section brand-section">
                    <Link to="/home" className="logo">
                        <Film className="logo-icon" />
                        <span className="logo-text">Cine<span className="highlight">Ticket</span></span>
                    </Link>
                    <p className="footer-desc">
                        Experience movies like never before. Book your tickets for the latest blockbusters with ease and comfort.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-link"><Facebook size={20} /></a>
                        <a href="#" className="social-link"><Twitter size={20} /></a>
                        <a href="#" className="social-link"><Instagram size={20} /></a>
                        <a href="#" className="social-link"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/cinemas">Cinemas</Link></li>
                        <li><Link to="/offers">Offers</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Support</h3>
                    <ul className="footer-links">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Contact Us</h3>
                    <ul className="contact-info">
                        <li><Mail size={16} /> janvee841301@gmail.com</li>
                        <li><Phone size={16} /> +91 9708140209</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} CineTicket. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
