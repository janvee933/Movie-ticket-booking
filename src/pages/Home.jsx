import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';

import MovieSection from '../components/MovieSection';
import Loader from '../components/Loader';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/movies');
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

    // Helper functions to filter movies by basic categories
    const getMoviesByCategory = (category) => {
        return movies.filter(movie => movie.category === category);
    };

    if (loading) return <Loader />;

    // Pick a featured movie (e.g., the first one, or random)
    const featuredMovie = movies.length > 0 ? movies[0] : null;

    return (
        <div className="home-page">
            {/* Hero Section - Using the Hero Component didn't allow passing dynamic data easily if it's not designed for it. 
               Let's use the inline Hero logic from the original file or adapt Hero component. 
               The original file had an inline hero section using featuredMovie. 
               I'll restore that inline hero for now to ensure it works dynamically. */}

            {featuredMovie && (
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
                            <span>{featuredMovie.duration || '2h 30m'}m</span>
                        </div>
                        <p className="hero-desc">{featuredMovie.description}</p>
                        <div className="hero-actions">
                            <Link to={`/movie/${featuredMovie._id}`} className="btn btn-primary">
                                Book Tickets
                            </Link>
                            {featuredMovie.trailerUrl && (
                                <a href={featuredMovie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                                    <Play size={18} style={{ marginRight: '0.5rem' }} /> Watch Trailer
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <div className="content-wrapper">
                <MovieSection
                    title="Hollywood Blockbusters"
                    movies={getMoviesByCategory('Hollywood')}
                />

                <MovieSection
                    title="Bollywood Hits"
                    movies={getMoviesByCategory('Bollywood')}
                />

                <MovieSection
                    title="Tollywood & South Indian Cinema"
                    movies={getMoviesByCategory('Tollywood')}
                />
            </div>
        </div>
    );
};

export default Home;
