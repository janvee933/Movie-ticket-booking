import express from 'express';
import Theater from '../models/Theater.js';
import Showtime from '../models/Showtime.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get theaters with their active showtimes/movies
router.get('/showtimes', async (req, res) => {
    try {
        const theaters = await Theater.find().lean();
        
        // For each theater, find unique movies it's showing
        const theaterData = await Promise.all(theaters.map(async (theater) => {
            const showtimes = await Showtime.find({ theater: theater._id })
                .populate('movie')
                .lean();
            
            // Get unique movies
            const uniqueMoviesSet = new Set();
            const movies = [];
            
            showtimes.forEach(s => {
                if (s.movie && !uniqueMoviesSet.has(s.movie._id.toString())) {
                    uniqueMoviesSet.add(s.movie._id.toString());
                    movies.push(s.movie);
                }
            });
            
            return {
                ...theater,
                movies
            };
        }));
        
        res.json(theaterData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all theaters
router.get('/', async (req, res) => {
    try {
        const theaters = await Theater.find().sort({ createdAt: -1 });
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Theater (Admin Only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const theater = new Theater(req.body);
        const savedTheater = await theater.save();
        res.status(201).json(savedTheater);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Theater (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updatedTheater = await Theater.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTheater);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Theater (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Theater.findByIdAndDelete(req.params.id);
        res.json({ message: 'Theater deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
