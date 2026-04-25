import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import useBooking from '../hooks/useBooking';

const MovieSection = ({ title, movies }) => {
    const { handleBooking } = useBooking();
    if (!movies || movies.length === 0) return null;

    return (
        <section className="section py-4">
            <div className="container">
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <h2 className="section-title mb-0">{title}</h2>
                    <Link to="/movies" className="text-decoration-none">View All</Link>
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
            </div>
        </section>
    );
};

export default MovieSection;
