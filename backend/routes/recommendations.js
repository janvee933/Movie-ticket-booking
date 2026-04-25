import express from 'express';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get personalized recommendations
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch user's bookings with movie details
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            });

        // Helper: Get movies user has already seen to exclude them (unless we want to recommend re-watching?)
        // Usually, for movie tickets, you don't book the same movie twice often.
        const bookedMovieIds = new Set();
        const genreCounts = {};
        const categoryCounts = {};

        bookings.forEach(booking => {
            if (booking.showtime && booking.showtime.movie) {
                const movie = booking.showtime.movie;
                bookedMovieIds.add(movie._id.toString());

                // Count genres (handle comma separated)
                const genres = movie.genre ? movie.genre.split(',').map(g => g.trim()) : [];
                genres.forEach(g => {
                    genreCounts[g] = (genreCounts[g] || 0) + 1;
                });

                // Count categories
                if (movie.category) {
                    categoryCounts[movie.category] = (categoryCounts[movie.category] || 0) + 1;
                }
            }
        });

        // Cold start check: if no bookings, return top rated
        if (bookings.length === 0) {
            const topRated = await Movie.find().sort({ rating: -1 }).limit(5);
            return res.json(topRated);
        }

        // 2. Identify top preferences
        const topGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1]) // Sort desc by count
            .map(([genre]) => genre)
            .slice(0, 3); // Top 3 genres

        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([cat]) => cat)
            .slice(0, 2); // Top 2 categories

        // 3. Query for recommendations
        // Find movies that match genre OR category, exclude already booked
        const query = {
            _id: { $nin: Array.from(bookedMovieIds) },
            $or: []
        };

        if (topGenres.length > 0) {
            // Using regex for partial match "Action" in "Action, Adventure"
            query.$or.push({ genre: { $in: topGenres.map(g => new RegExp(g, 'i')) } });
        }
        if (topCategories.length > 0) {
            query.$or.push({ category: { $in: topCategories } });
        }

        // If no preferences found (maybe bad data), simplify query
        if (query.$or.length === 0) {
            delete query.$or;
        }

        let recommendations = await Movie.find(query).limit(10);

        // 4. Sort/Rank
        // We can sort by rating to ensure quality
        recommendations.sort((a, b) => b.rating - a.rating);

        // If strict filtering returned few/no results, fill with top rated
        if (recommendations.length < 5) {
            const filler = await Movie.find({
                _id: { $nin: [...Array.from(bookedMovieIds), ...recommendations.map(r => r._id)] }
            })
                .sort({ rating: -1 })
                .limit(5 - recommendations.length);
            recommendations = [...recommendations, ...filler];
        }

        res.json(recommendations.slice(0, 5));

    } catch (error) {
        console.error('Recommendation API Error:', error);
        res.status(500).json({ message: 'Server error generating recommendations' });
    }
});

export default router;
