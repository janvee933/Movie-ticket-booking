import express from 'express';
import Booking from '../models/Booking.js';
import Showtime from '../models/Showtime.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all user bookings or all for admin
router.get('/', verifyToken, async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            query.user = req.user._id;
        }

        const bookings = await Booking.find(query)
            .populate('user', 'name email')
            .populate({
                path: 'showtime',
                populate: { 
                    path: 'movie theater',
                    select: 'title image genre language name location'
                }
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single booking by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'showtime',
                populate: { 
                    path: 'movie theater',
                    select: 'title image genre language name location'
                }
            });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking or is admin
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && booking.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Booking (User)
router.post('/', verifyToken, async (req, res) => {
    try {
        // Need to handle atomic updates for seat locking in a real app
        // Keeping it simple here
        const { showtimeId, seats, totalAmount, paymentMethod, phoneNumber, couponCode, customerName, paymentId, orderId } = req.body;

        const booking = new Booking({
            customerName,
            user: req.user._id,
            showtime: showtimeId,
            seats,
            totalAmount,
            paymentMethod,
            phoneNumber,
            couponCode,
            paymentId
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
