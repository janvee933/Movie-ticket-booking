import express from 'express';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Booking from '../models/Booking.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get Admin Dashboard Stats
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' }); // Only count regular users
        const totalMovies = await Movie.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Calculate total revenue from all bookings
        // Note: In real app, might filter by 'confirmed' status if payment gateway is integrated
        const revenueAggregate = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAggregate.length > 0 ? revenueAggregate[0].total : 0;

        // Recent Bookings (Last 5)
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email');

        res.json({
            users: totalUsers,
            movies: totalMovies,
            bookings: totalBookings,
            revenue: totalRevenue,
            recentBookings
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching stats', error: error.message });
    }
});

// Get User List for Admin
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Toggle User Status (Block/Unblock)
router.patch('/users/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();
        
        res.json({ message: `User status updated to ${user.status}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// Get Revenue History (Last 7 Days) for Charts
router.get('/revenue-stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const stats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days },
                    status: 'confirmed'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching revenue stats' });
    }
});

// Get Seat Status for Admin Control
router.get('/showtimes/:id/seats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find({ showtime: req.params.id, status: 'confirmed' });
        const bookedSeats = bookings.flatMap(b => b.seats);
        res.json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seat status' });
    }
});

export default router;
