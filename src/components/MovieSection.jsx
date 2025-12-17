import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

const MovieSection = ({ title, movies }) => {
    if (!movies || movies.length === 0) return null;

    return (
        <section className="section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <Link to="/movies" className="view-all">View All</Link>
                </div>

                <div className="movies-grid">
                    {movies.map((movie) => (
                        <Link to={`/movie/${movie._id}`} key={movie._id} className="movie-card">
                            <div className="card-image-wrapper">
                                <img src={movie.image} alt={movie.title} className="card-image" />
                                <div className="card-overlay">
                                    <div className="btn btn-primary btn-sm">
                                        Book Now
                                    </div>
                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="card-title">{movie.title}</h3>
                                <div className="card-meta">
                                    <span className="card-genre">{movie.genre}</span>
                                    <span className="card-rating">
                                        <Star size={14} fill="#ffd700" color="#ffd700" />
                                        {movie.rating}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MovieSection;
