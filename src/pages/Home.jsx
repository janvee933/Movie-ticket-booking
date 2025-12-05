import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Calendar } from 'lucide-react';
import { movies } from '../data/movies';
import './Home.css';

const Home = () => {
    const featuredMovie = movies[0];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero" style={{ backgroundImage: `url(${featuredMovie.image})` }}>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <span className="tag">Now Showing</span>
                    <h1 className="hero-title">{featuredMovie.title}</h1>
                    <div className="hero-meta">
                        <span className="rating"><Star size={16} fill="#ffd700" color="#ffd700" /> {featuredMovie.rating}</span>
                        <span className="dot">•</span>
                        <span>{featuredMovie.genre}</span>
                        <span className="dot">•</span>
                        <span>2h 28m</span>
                    </div>
                    <p className="hero-desc">{featuredMovie.description}</p>
                    <div className="hero-actions">
                        <Link to={`/booking/${featuredMovie.id}`} className="btn btn-primary">
                            Book Tickets
                        </Link>
                        <button className="btn btn-outline">
                            <Play size={18} style={{ marginRight: '0.5rem' }} /> Watch Trailer
                        </button>
                    </div>
                </div>
            </section>

            {/* Movies Grid */}
            <section className="section container">
                <div className="section-header">
                    <h2 className="section-title">Now Showing</h2>
                    <Link to="/movies" className="view-all">View All</Link>
                </div>

                <div className="movies-grid">
                    {movies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                            <div className="card-image-wrapper">
                                <img src={movie.image} alt={movie.title} className="card-image" />
                                <div className="card-overlay">
                                    <button className="btn btn-primary btn-sm">Book Now</button>
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{movie.title}</h3>
                                <div className="card-meta">
                                    <span className="card-genre">{movie.genre}</span>
                                    <span className="card-rating"><Star size={14} fill="#ffd700" color="#ffd700" /> {movie.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
