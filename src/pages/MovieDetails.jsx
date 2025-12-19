import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ArrowLeft } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import TrailerModal from '../components/TrailerModal';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    const handleReviewAdded = (updatedMovie) => {
        setMovie(updatedMovie);
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`/api/movies/${id}`);
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

    if (loading) return <div className="movie-details-page">Loading...</div>;

    if (!movie) {
        return (
            <div className="movie-details-page">
                <div className="container" style={{ paddingTop: '100px' }}>
                    <h1>Movie not found</h1>
                    <Link to="/home" className="btn btn-primary">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-details-page">
            <div className="backdrop" style={{ backgroundImage: `url(${movie.image})` }}>
                <div className="backdrop-overlay"></div>
            </div>

            <div className="container content-wrapper">
                <Link to="/home" className="back-link">
                    <ArrowLeft size={20} /> Back to Home
                </Link>

                <div className="details-grid">
                    <div className="poster-wrapper">
                        <img src={movie.image} alt={movie.title} className="poster" />
                    </div>

                    <div className="info-wrapper">
                        <h1 className="movie-title">{movie.title}</h1>

                        <div className="meta-row">
                            <span className="meta-item"><Star size={18} fill="#ffd700" color="#ffd700" /> {movie.rating}/5</span>
                            <span className="meta-item"><Clock size={18} /> 2h 30m</span>
                            <span className="meta-item"><Calendar size={18} /> 2024</span>
                            <span className="genre-badge">{movie.genre}</span>
                        </div>

                        <div className="synopsis">
                            <h3>Synopsis</h3>
                            <p>{movie.description}</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>

                        <div className="cast-section">
                            <h3>Cast</h3>
                            <div className="cast-list">
                                <div className="cast-member">Actor One</div>
                                <div className="cast-member">Actor Two</div>
                                <div className="cast-member">Actor Three</div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <Link to={`/booking/${movie._id}`} className="btn btn-primary btn-lg">
                                Book Tickets
                            </Link>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => setShowTrailer(true)}
                            >
                                <Play size={20} style={{ marginRight: '0.5rem' }} /> Watch Trailer
                            </button>
                        </div>
                    </div>
                </div>

                <ReviewSection
                    movieId={movie._id}
                    reviews={movie.reviews || []}
                    onReviewAdded={handleReviewAdded}
                />
            </div>

            <TrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                trailerUrl={movie.trailerUrl}
            />
        </div>
    );
};

export default MovieDetails;
