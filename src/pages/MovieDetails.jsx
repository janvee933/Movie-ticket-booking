import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Play, ArrowLeft } from 'lucide-react';
import { movies } from '../data/movies';
import './MovieDetails.css';

const MovieDetails = () => {
    const { id } = useParams();
    const movie = movies.find(m => m.id === parseInt(id));

    if (!movie) {
        return <div className="container" style={{ paddingTop: '100px' }}>Movie not found</div>;
    }

    return (
        <div className="movie-details-page">
            <div className="backdrop" style={{ backgroundImage: `url(${movie.image})` }}>
                <div className="backdrop-overlay"></div>
            </div>

            <div className="container content-wrapper">
                <Link to="/" className="back-link">
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
                            <Link to={`/booking/${movie.id}`} className="btn btn-primary btn-lg">
                                Book Tickets
                            </Link>
                            <button className="btn btn-outline btn-lg">
                                <Play size={20} style={{ marginRight: '0.5rem' }} /> Watch Trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
