import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import './ReviewSection.css';

const ReviewSection = ({ movieId, reviews = [], onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('You must be logged in to review.');

            const res = await fetch(`/api/movies/${movieId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating,
                    comment,
                    userName: user?.name
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to add review');

            setComment('');
            setRating(5);
            if (onReviewAdded) onReviewAdded(data); // Pass back updated movie

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-section">
            <h3 className="section-title">Reviews ({reviews.length})</h3>

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="avatar-placeholder">
                                        <User size={20} />
                                    </div>
                                    <span className="reviewer-name">{review.user}</span>
                                </div>
                                <div className="review-rating">
                                    <Star size={16} fill="#ffd700" color="#ffd700" />
                                    <span>{review.rating}/5</span>
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {user ? (
                <div className="add-review-form">
                    <h4>Write a Review</h4>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="rating-select">
                            <label>Rating:</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={`star-btn ${rating >= star ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star size={24} fill={rating >= star ? "#ffd700" : "none"} color="#ffd700" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            placeholder="Share your thoughts on this movie..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="4"
                        ></textarea>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="login-prompt">
                    <p>Please log in to write a review.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
