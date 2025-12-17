import express from 'express';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (Admin Only)
// Or get user bookings if not admin (need logic branching)
router.get('/', verifyToken, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const bookings = await Booking.find()
                .populate('user', 'name email')
                .populate({
                    path: 'showtime',
                    populate: { path: 'movie theater', select: 'title name' }
                })
                .sort({ createdAt: -1 });
            return res.json(bookings);
        } else {
            // User only sees their own
            const bookings = await Booking.find({ user: req.user._id })
                .populate({
                    path: 'showtime',
                    populate: { path: 'movie theater', select: 'title name' }
                })
                .sort({ createdAt: -1 });
            return res.json(bookings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Booking (User)
router.post('/', verifyToken, async (req, res) => {
    try {
        // Need to handle atomic updates for seat locking in a real app
        // Keeping it simple here
        const { showtimeId, seats, totalAmount } = req.body;

        const booking = new Booking({
            user: req.user._id,
            showtime: showtimeId,
            seats,
            totalAmount
        });

        await booking.save();

        // Update showtime booked seats
        // This is a naive implementation; race conditions possible
        await Showtime.findByIdAndUpdate(showtimeId, {
            $push: { bookedSeats: { $each: seats } }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update Booking Status (Admin)
router.put('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
