import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname in modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from current directory
dotenv.config();

// If not found (or specific key missing), try parent directory
if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not found in current directory .env, checking parent directory...");
    dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

console.log("Loaded MONGO_URI:", process.env.MONGO_URI ? "Defined" : "Undefined");

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { generateToken } from './middleware/auth.js';
import User from './models/User.js';
import movieRoutes from './routes/movies.js';

import theaterRoutes from './routes/theaters.js';
import showtimeRoutes from './routes/showtimes.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';
import recommendationRoutes from './routes/recommendations.js';
import offerRoutes from './routes/offers.js';

const app = express();
// Use SERVER_PORT if available, otherwise default to 5000. 
// We explicitly ignore PORT if it matches commonly used frontend ports like 5173 to avoid conflicts.
const PORT = process.env.SERVER_PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));

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




// Signup Route
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

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
        const { email, password } = req.body;

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
