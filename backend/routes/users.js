import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Update User Profile
router.put('/profile', verifyToken, uploadImage('profileImage', '/users'), async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, profileImage } = req.body;

        // Validations
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const updateData = { name, email };
        if (profileImage) updateData.profileImage = profileImage;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
});

export default router;
