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
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Recent Bookings (Last 5)
        const recentBookings = await Booking.find({ status: 'confirmed' })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('showtime'); // Might need deep populate for movie title but showtime usually has movie ID.

        // Top 5 Movies by Revenue
        // Since Booking has showtime, and Showtime has movie, we need to join.
        // For simplicity, we can do a simpler aggregation or just client-side for now, but aggregation is better.
        // Let's do a basic "Last 5 Bookings" first which is most useful.

        res.json({
            users: totalUsers,
            movies: totalMovies,
            bookings: totalBookings,
            revenue: totalRevenue,
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
