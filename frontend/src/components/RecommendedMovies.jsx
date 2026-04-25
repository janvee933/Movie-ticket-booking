import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ThumbsUp } from 'lucide-react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import useBooking from '../hooks/useBooking';

const RecommendedMovies = () => {
    const { handleBooking } = useBooking();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const storedToken = localStorage.getItem('token');
            // If user is not logged in, we don't show specific recommendations (or could show popular)
            // But API requires token, so we skip if no token.
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/recommendations', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMovies(data);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading || movies.length === 0) return null;

    return (
        <section className="section recommendations-section"
            style={{
                background: 'linear-gradient(to right, #1f2937, #111827)',
                padding: '3rem 0',
                marginBottom: '2rem',
                borderTop: '1px solid #374151',
                borderBottom: '1px solid #374151'
            }}
        >
            <div className="container">
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(250, 204, 21, 0.2)', borderRadius: '50%', display: 'flex' }}>
                            <Sparkles size={24} color="#facc15" />
                        </div>
                        <div>
                            <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>Recommended For You</h2>
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Based on your watching history</p>
                        </div>
                    </div>
                </div>

                <Row className="g-4">
                    {movies.map((movie) => (
                        <Col key={movie._id} xs={6} md={3} lg={2}>
                            <Card className="h-100 border-0 bg-transparent text-white movie-card-hover">
                                <div className="position-relative overflow-hidden rounded" style={{ aspectRatio: '2/3' }}>
                                    <Link to={`/movie/${movie._id}`}>
                                        <Card.Img
                                            variant="top"
                                            src={movie.image}
                                            alt={movie.title}
                                            className="h-100 w-100 object-fit-cover"
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
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.7)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.75rem',
                                        color: '#4ade80'
                                    }}>
                                        <ThumbsUp size={12} /> 95% Match
                                    </div>
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
            </div>
        </section>
    );
};

export default RecommendedMovies;
