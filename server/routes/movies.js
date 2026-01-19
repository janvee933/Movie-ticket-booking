import express from 'express';
import Movie from '../models/Movie.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/uploads/'); // Save to server/uploads relative to CWD (root)
    },
    filename: function (req, file, cb) {
        cb(null, 'movie-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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

// Create Movie (Admin Only) - Now with Image Upload
router.post('/', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const movieData = req.body;

        // If a file is uploaded, set the image URL
        if (req.file) {
            movieData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const movie = new Movie(movieData);
        const savedMovie = await movie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Movie (Admin Only) - Now with Image Upload
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const movieData = req.body;

        // If a file is uploaded, update the image URL
        if (req.file) {
            movieData.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

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
