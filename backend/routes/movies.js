import express from 'express';
import Movie from '../models/Movie.js';
import { generateDefaultShowtimes } from '../utils/showtimeGenerator.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Movie (Admin Only) - Now with Image Upload and Auto-Showtimes
router.post('/', verifyToken, verifyAdmin, uploadImage('image', '/movies'), async (req, res) => {
    try {
        const movieData = req.body;

        const movie = new Movie(movieData);
        const savedMovie = await movie.save();
        
        // Automatically generate showtimes for the new movie
        await generateDefaultShowtimes(savedMovie._id);
        
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Movie (Admin Only) - Now with Image Upload
router.put('/:id', verifyToken, verifyAdmin, uploadImage('image', '/movies'), async (req, res) => {
    try {
        const movieData = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            movieData,
            { new: true }
        );
        if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add Review
router.post('/:id/reviews', verifyToken, async (req, res) => {
    try {
        const { rating, comment, userName } = req.body;
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const review = {
            user: userName || 'Anonymous', // Ideally get name from user token/db
            rating: Number(rating),
            comment,
            createdAt: Date.now()
        };

        movie.reviews.push(review);

        // Recalculate average rating
        movie.rating = movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;
        // Round to 1 decimal place
        movie.rating = Math.round(movie.rating * 10) / 10;

        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Movie (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
