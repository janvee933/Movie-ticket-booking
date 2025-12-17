import express from 'express';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Booking from '../models/Booking.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalMovies = await Movie.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Calculate total revenue
        const revenueResult = await Booking.aggregate([
            { $match: { status: 'confirmed' } }, // Only count confirmed
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            users: totalUsers,
            movies: totalMovies,
            bookings: totalBookings,
            revenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
