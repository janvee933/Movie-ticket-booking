import express from 'express';
import User from '../models/User.js';
import { verifyToken, verifySuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (SuperAdmin only)
router.get('/', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user role (SuperAdmin only)
router.put('/:id/role', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json({ message: `User role updated to ${role}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user status (SuperAdmin only)
router.put('/:id/status', verifyToken, verifySuperAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();
        res.json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
