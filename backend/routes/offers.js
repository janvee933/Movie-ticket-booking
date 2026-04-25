import express from 'express';
import Offer from '../models/Offer.js';
import Booking from '../models/Booking.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validate Coupon (Public but requires Token for user check)
router.post('/validate', verifyToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user._id;

        // 1. Check if coupon exists and is active
        const coupon = await Offer.findOne({ code: code.toUpperCase(), isActive: true });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon code.' });
        }

        // 2. Check if user has already used this coupon
        const existingBooking = await Booking.findOne({ user: userId, couponCode: code.toUpperCase() });
        if (existingBooking) {
            return res.status(400).json({ message: 'Coupon already used!' });
        }

        res.json({ message: 'Coupon valid', coupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
