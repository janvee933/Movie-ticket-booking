import express from 'express';
import Theater from '../models/Theater.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

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
