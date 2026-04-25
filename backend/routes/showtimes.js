import express from 'express';
import Showtime from '../models/Showtime.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get showtimes (filter by movie or theater if needed)
router.get('/', async (req, res) => {
    try {
        const { movie, theater, date } = req.query;
        let query = {};
        if (movie) query.movie = movie;
        if (theater) query.theater = theater;
        // Date filtering logic would go here

        const showtimes = await Showtime.find(query)
            .populate('movie', 'title')
            .populate('theater', 'name city screens')
            .sort({ startTime: 1 });

        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Showtime (Admin Only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const showtime = new Showtime(req.body);
        const savedShowtime = await showtime.save();
        res.status(201).json(savedShowtime);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Showtime (Admin Only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updatedShowtime = await Showtime.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedShowtime);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Showtime (Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Showtime.findByIdAndDelete(req.params.id);
        res.json({ message: 'Showtime deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
