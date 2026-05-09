import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ArrowLeft, Share2, Heart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewSection from '../components/ReviewSection';
import TrailerModal from '../components/TrailerModal';
import useBooking from '../hooks/useBooking';
import { API_URL } from '../utils/api';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const { handleBooking } = useBooking();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`${API_URL}/api/movies/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMovie(data);
                } else {
                    console.error('Failed to fetch movie:', res.statusText);
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const handleReviewAdded = (updatedMovie) => {
        setMovie(updatedMovie);
    };

    if (loading) return (
        <div className="loading-screen">
            <div className="loader"></div>
        </div>
    );

    if (!movie) return <div>Movie not found</div>;

    return (
        <motion.div
            className="movie-details-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Immersive Backdrop */}
            <div className="immersive-backdrop">
                <div className="backdrop-image" style={{ backgroundImage: `url(${movie.image})` }}></div>
                <div className="backdrop-gradient"></div>
            </div>

            <div className="container details-container">
                <Link to="/home" className="back-nav">
                    <ArrowLeft size={20} /> <span className="ms-2">Back to Browse</span>
                </Link>

                <div className="content-grid">
                    {/* Left Column: Poster & Quick Actions */}
                    <motion.div
                        className="poster-column"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <div className="poster-frame">
                            <img src={movie.image} alt={movie.title} className="main-poster" />
                            <div className="poster-glow"></div>
                        </div>

                        <div className="quick-stats">
                            <div className="stat-box">
                                <Star fill="#FFD700" color="#FFD700" size={20} />
                                <span className="stat-value">{movie.rating}/5</span>
                                <span className="stat-label">Rating</span>
                            </div>
                            <div className="stat-box">
                                <Award color="#E50914" size={20} />
                                <span className="stat-value">#1</span>
                                <span className="stat-label">Trending</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Info & Booking */}
                    <motion.div
                        className="info-column"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="movie-header">
                            <h1 className="movie-title-large">{movie.title}</h1>
                            <div className="movie-badges">
                                <span className="badge-outline">{movie.genre}</span>
                                <span className="badge-outline">2h 30m</span>
                                <span className="badge-outline">UA</span>
                                <span className="badge-filled">4K Dolby Atmos</span>
                            </div>
                        </div>

                        <p className="movie-synopsis">
                            {movie.description}
                        </p>

                        <div className="cast-preview">
                            <h3 className="section-label">Top Cast</h3>
                            <div className="cast-avatars">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="cast-avatar-placeholder"></div>
                                ))}
                            </div>
                        </div>

                        <div className="action-row">
                            <button 
                                onClick={() => handleBooking(movie._id)} 
                                className="btn btn-primary btn-xl border-0"
                            >
                                Book Tickets
                            </button>
                            <button
                                className="btn btn-glass btn-xl"
                                onClick={() => setShowTrailer(true)}
                            >
                                <Play size={20} className="me-2" /> Watch Trailer
                            </button>
                            <button className="btn btn-icon-glass">
                                <Heart size={20} />
                            </button>
                            <button className="btn btn-icon-glass">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <motion.div
                    className="reviews-container"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <ReviewSection
                        movieId={movie._id}
                        reviews={movie.reviews || []}
                        onReviewAdded={handleReviewAdded}
                    />
                </motion.div>
            </div>

            <TrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                trailerUrl={movie.trailerUrl}
            />
        </motion.div>
    );
};

export default MovieDetails;
