import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Globe, Star } from 'lucide-react';
import './Movies.css';

const Movies = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedGenre, setSelectedGenre] = useState('All');

    const categories = ['All', 'Hollywood', 'Bollywood', 'Tollywood'];
    const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Animation', 'Thriller', 'Romance'];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch('/api/movies');
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

    // Update local search state when URL param changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const filteredMovies = movies.filter(movie => {
        const categoryMatch = selectedCategory === 'All' || movie.category === selectedCategory;
        // Genre check: simpler "includes" check since genres can be comma separated or single word
        const genreMatch = selectedGenre === 'All' || (movie.genre && movie.genre.includes(selectedGenre));
        const searchMatch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && genreMatch && searchMatch;
    });

    if (loading) return <div className="movies-page" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="movies-page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Explore Movies</h1>

                    <div className="filters-wrapper">
                        {/* Search Display (if active) */}
                        {searchQuery && (
                            <div className="active-search-display">
                                <span>Results for: "{searchQuery}"</span>
                                <button onClick={() => {
                                    setSearchQuery('');
                                    setSearchParams({});
                                }} className="clear-search">Clear</button>
                            </div>
                        )}

                        {/* Category/Industry Filter */}
                        <div className="filter-group">
                            <Globe size={18} className="filter-icon" />
                            <div className="filter-options">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Genre Filter */}
                        <div className="filter-group">
                            <Filter size={18} className="filter-icon" />
                            <div className="filter-options">
                                {genres.map(genre => (
                                    <button
                                        key={genre}
                                        className={`filter-chip ${selectedGenre === genre ? 'active' : ''}`}
                                        onClick={() => setSelectedGenre(genre)}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="movies-grid">
                    {filteredMovies.map(movie => (
                        <div key={movie._id} className="movie-card">
                            <div className="card-image-wrapper">
                                <Link to={`/movie/${movie._id}`}>
                                    <img src={movie.image} alt={movie.title} className="card-image" />
                                </Link>
                                <div className="card-overlay">
                                    <Link to={`/booking/${movie._id}`} className="btn btn-primary btn-sm">
                                        Book Now
                                    </Link>
                                </div>
                                <span className="category-badge">{movie.category}</span>
                            </div>
                            <div className="card-content">
                                <Link to={`/movie/${movie._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 className="card-title">{movie.title}</h3>
                                </Link>
                                <div className="card-meta">
                                    <span className="card-genre">{movie.genre}</span>
                                    <span className="card-rating"><Star size={14} fill="#ffd700" color="#ffd700" /> {movie.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="no-results">
                        <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No movies found matching your criteria.</p>
                        <button
                            className="btn btn-outline"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedGenre('All');
                                setSearchQuery('');
                                setSearchParams({});
                            }}
                            style={{ marginTop: '1rem' }}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
