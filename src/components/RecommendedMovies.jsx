import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ThumbsUp } from 'lucide-react';

const RecommendedMovies = () => {
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

export default RecommendedMovies;
