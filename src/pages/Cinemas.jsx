import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { cinemas } from '../data/cinemas';
import './Cinemas.css';

const Cinemas = () => {
    return (
        <div className="cinemas-page">
            <div className="container">
                <h1 className="page-title">Cinemas Near You</h1>

                <div className="cinemas-list">
                    {cinemas.map(cinema => (
                        <div key={cinema.id} className="cinema-card">
                            <div className="cinema-header">
                                <div className="cinema-info">
                                    <h2 className="cinema-name">{cinema.name}</h2>
                                    <p className="cinema-location">
                                        <MapPin size={16} style={{ marginRight: '0.5rem' }} />
                                        {cinema.location}
                                    </p>
                                </div>
                                <div className="cinema-rating">
                                    <Star size={16} fill="#ffd700" color="#ffd700" /> 4.5
                                </div>
                            </div>

                            <div className="cinema-movies">
                                <h3 className="movies-heading">Now Showing</h3>
                                <div className="movies-scroll">
                                    {cinema.movies.filter(m => m).map(movie => (
                                        <Link to={`/booking/${movie.id}`} key={movie.id} className="mini-movie-card">
                                            <img src={movie.image} alt={movie.title} className="mini-poster" />
                                            <div className="mini-content">
                                                <h4 className="mini-title">{movie.title}</h4>
                                                <span className="mini-genre">{movie.genre}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Cinemas;
