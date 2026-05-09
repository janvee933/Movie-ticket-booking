import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Info, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import useBooking from '../hooks/useBooking';
import { API_URL } from '../utils/api';

import MovieSection from '../components/MovieSection';
import RecommendedMovies from '../components/RecommendedMovies';
import Loader from '../components/Loader';
import './Home.css';

const Home = () => {
    const { t } = useTranslation();
    const { handleBooking } = useBooking();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(`${API_URL}/api/movies`);
                const data = await res.json();
                setMovies(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const getMoviesByCategory = (category) => {
        return movies.filter(movie => movie.category === category);
    };

    if (loading) return <Loader />;

    // Use the first movie as the featured hero movie
    const featuredMovie = movies.length > 0 ? movies[0] : null;

    return (
        <div className="home-page">
            {/* Immersive Hero Section */}
            {featuredMovie && (
                <section className="hero-section">
                    <div className="hero-background">
                        <img src={featuredMovie.image} alt={featuredMovie.title} className="hero-img" />
                    </div>
                    <div className="hero-overlay"></div>
                    <div className="hero-gradient-overlay"></div>

                    <Container className="hero-content">
                        <div className="hero-text-wrapper">
                            <div className="hero-badge">
                                <span className="pulsing-dot"></span>
                                {t('home.now_showing')}
                            </div>

                            <h1 className="hero-title">{featuredMovie.title}</h1>

                            <div className="hero-info">
                                <span className="info-item rating">
                                    <Star size={20} fill="#FFD700" color="#FFD700" className="rating-star" />
                                    {featuredMovie.rating}/10
                                </span>
                                <span>|</span>
                                <span className="info-item">{featuredMovie.genre}</span>
                                <span>|</span>
                                <span className="info-item"><Clock size={18} /> {featuredMovie.duration || '2h 15m'}</span>
                            </div>

                            <p className="hero-description">
                                {featuredMovie.description}
                            </p>

                            <div className="hero-buttons">
                                <Button 
                                    onClick={() => handleBooking(featuredMovie._id)} 
                                    className="btn btn-primary btn-lg border-0"
                                >
                                    {t('home.book_tickets')} <ArrowRight size={20} className="ms-2" />
                                </Button>
                                {featuredMovie.trailerUrl && (
                                    <a
                                        href={featuredMovie.trailerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-lg"
                                    >
                                        <div className="play-icon-wrapper me-2">
                                            <Play size={14} fill="black" />
                                        </div>
                                        {t('home.watch_trailer')}
                                    </a>
                                )}
                            </div>
                        </div>
                    </Container>
                </section>
            )}

            <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
                {/* Personal Recommendations */}
                <div className="section-wrapper">
                    <RecommendedMovies />
                </div>

                <div className="section-wrapper">
                    <MovieSection
                        title={t('home.hollywood')}
                        movies={getMoviesByCategory('Hollywood')}
                    />
                </div>

                <div className="section-wrapper">
                    <MovieSection
                        title={t('home.bollywood')}
                        movies={getMoviesByCategory('Bollywood')}
                    />
                </div>

                <div className="section-wrapper">
                    <MovieSection
                        title={t('home.tollywood')}
                        movies={getMoviesByCategory('Tollywood')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
