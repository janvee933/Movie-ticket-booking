import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, AlertCircle } from 'lucide-react';
// import { cinemas } from '../data/cinemas'; // Removed static data
import './Cinemas.css';

const Cinemas = () => {
    const [cinemas, setCinemas] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchCinemas = async () => {
            try {
                const res = await fetch('/api/theaters/showtimes');
                if (!res.ok) throw new Error("Failed to fetch cinemas data");
                const data = await res.json();
                setCinemas(data);
            } catch (err) {
                console.error("Error fetching cinemas:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCinemas();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error) return (
        <div className="container py-5 text-center text-danger">
            <AlertCircle size={48} className="mb-3" />
            <h3>Error loading cinemas</h3>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="cinemas-page">
            <div className="container">
                <h1 className="page-title">Cinemas Near You</h1>

                <div className="cinemas-list">
                    {cinemas.length > 0 ? cinemas.map(cinema => (
                        <div key={cinema._id} className="cinema-card">
                            <div className="cinema-header">
                                <div className="cinema-info">
                                    <h2 className="cinema-name">{cinema.name}</h2>
                                    <p className="cinema-location">
                                        <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                                        {cinema.location}, {cinema.city}
                                    </p>
                                </div>
                                <div className="cinema-rating">
                                    <Star size={16} fill="#ffd700" color="#ffd700" /> {cinema.rating || '4.5'}
                                </div>
                            </div>

                            <div className="cinema-movies">
                                <h3 className="movies-heading">Now Showing</h3>
                                <div className="movies-scroll">
                                    {cinema.movies && cinema.movies.length > 0 ? cinema.movies.map(movie => (
                                        <Link to={`/booking/${movie._id}`} key={movie._id} className="mini-movie-card">
                                            <img src={movie.image} alt={movie.title} className="mini-poster" />
                                            <div className="mini-content">
                                                <h4 className="mini-title">{movie.title}</h4>
                                                <span className="mini-genre">{movie.genre}</span>
                                            </div>
                                        </Link>
                                    )) : <p className="text-muted p-3">No movies currently showing</p>}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No cinemas found in your area.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cinemas;
