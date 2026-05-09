import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Globe, Star } from 'lucide-react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import useBooking from '../hooks/useBooking';
import { API_URL } from '../utils/api';
import './Movies.css';

const Movies = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { handleBooking } = useBooking();
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

    // Update local search state when URL param changes
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const filteredMovies = movies.filter(movie => {
        const categoryMatch = selectedCategory === 'All' || movie.category === selectedCategory;
        const genreMatch = selectedGenre === 'All' || (movie.genre && movie.genre.includes(selectedGenre));
        const searchMatch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && genreMatch && searchMatch;
    });

    if (loading) return <div className="text-center pt-5 mt-5">Loading...</div>;

    return (
        <div className="movies-page pt-5 mt-5">
            <Container>
                <div className="page-header mb-5">
                    <h1 className="page-title text-center mb-4">Explore Movies</h1>

                    {/* Filters Section */}
                    <div className="filters-wrapper d-flex flex-column gap-3">
                        {/* Search Display */}
                        {searchQuery && (
                            <div className="alert alert-info d-flex justify-content-between align-items-center">
                                <span>Results for: "{searchQuery}"</span>
                                <Button variant="outline-dark" size="sm" onClick={() => {
                                    setSearchQuery('');
                                    setSearchParams({});
                                }}>Clear</Button>
                            </div>
                        )}

                        <Row className="gy-3">
                            <Col md={6}>
                                <div className="filter-group d-flex align-items-center gap-2">
                                    <Globe size={18} className="text-muted" />
                                    <div className="filter-options d-flex flex-wrap gap-2">
                                        {categories.map(category => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? 'primary' : 'outline-secondary'}
                                                size="sm"
                                                onClick={() => setSelectedCategory(category)}
                                                className="rounded-pill"
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="filter-group d-flex align-items-center gap-2">
                                    <Filter size={18} className="text-muted" />
                                    <div className="filter-options d-flex flex-wrap gap-2">
                                        {genres.map(genre => (
                                            <Button
                                                key={genre}
                                                variant={selectedGenre === genre ? 'primary' : 'outline-secondary'}
                                                size="sm"
                                                onClick={() => setSelectedGenre(genre)}
                                                className="rounded-pill"
                                            >
                                                {genre}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Movies Grid */}
                <Row className="g-4">
                    {filteredMovies.map(movie => (
                        <Col key={movie._id} xs={6} md={3} lg={2}>
                            <Card className="h-100 movie-card border-0 bg-transparent text-white">
                                <div className="card-image-wrapper position-relative overflow-hidden rounded">
                                    <Link to={`/movie/${movie._id}`}>
                                        <Card.Img
                                            variant="top"
                                            src={movie.image}
                                            alt={movie.title}
                                            className="h-100 w-100 object-fit-cover"
                                            style={{ minHeight: '300px' }}
                                        />
                                    </Link>
                                    <div className="movie-card-overlay">
                                        <Button 
                                            onClick={() => handleBooking(movie._id)} 
                                            className="btn btn-primary btn-sm w-100 border-0"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                    <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2">
                                        {movie.category}
                                    </Badge>
                                </div>
                                <Card.Body className="px-0">
                                    <Link to={`/movie/${movie._id}`} className="text-decoration-none text-white">
                                        <Card.Title className="h5 mb-1 text-truncate">{movie.title}</Card.Title>
                                    </Link>
                                    <div className="d-flex justify-content-between align-items-center text-muted small">
                                        <span>{movie.genre?.split(',')[0]}</span>
                                        <span className="d-flex align-items-center gap-1">
                                            <Star size={14} fill="#ffd700" color="#ffd700" />
                                            {movie.rating}
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-5">
                        <Search size={48} className="mb-3 opacity-50" />
                        <p>No movies found matching your criteria.</p>
                        <Button
                            variant="outline-light"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedGenre('All');
                                setSearchQuery('');
                                setSearchParams({});
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Movies;
