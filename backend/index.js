import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from current directory
dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI ? "Defined" : "Undefined");

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { generateToken, JWT_SECRET } from './middleware/auth.js';
import User from './models/User.js';
import movieRoutes from './routes/movies.js';

import theaterRoutes from './routes/theaters.js';
import showtimeRoutes from './routes/showtimes.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import recommendationRoutes from './routes/recommendations.js';
import offerRoutes from './routes/offers.js';
import paymentRoutes from './routes/payments.js';

const app = express();
// Use SERVER_PORT if available, otherwise default to 5000. 
// We explicitly ignore PORT if it matches commonly used frontend ports like 5173 to avoid conflicts.
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Root route for health check and to avoid "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Movie Ticket Booking API is running successfully!');
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/payments', paymentRoutes);




// Signup Route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email.toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        // Note: Password should be hashed in production
        const newUser = new User({ name, email, password }); // Default role 'user'
        await newUser.save();

        const token = generateToken(newUser._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email.toLowerCase();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Successful login
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Google Sign-In Route
app.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name, photoUrl } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if not exists
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            user = new User({
                name,
                email,
                password: randomPassword, // Required by schema
                role: 'user',
                profileImage: photoUrl
            });
            await user.save();
        }

        // Generate Token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Google login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error('Google Sign-In error:', error);
        res.status(500).json({ message: 'Server error during Google Sign-In' });
    }
});

// Serve Frontend Static Files
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Profile / Session Validation Route
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid session' });
    }
});

// Catch-all route to serve frontend index.html for any non-API routes
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
