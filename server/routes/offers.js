import express from 'express';
import Offer from '../models/Offer.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get active offers (Public)
router.get('/', async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { isActive: true };
        const offers = await Offer.find(query).sort({ createdAt: -1 });
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Offer (Admin)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const offer = new Offer(req.body);
        const savedOffer = await offer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Offer (Admin)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete Offer (Admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
