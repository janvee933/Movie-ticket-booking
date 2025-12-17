import mongoose from 'mongoose';
import dotenv from 'dotenv/config'; // Auto-load env vars
import Movie from './models/Movie.js';
import Theater from './models/Theater.js';
import Showtime from './models/Showtime.js';

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedShowtimes = async () => {
    try {
        console.log('Seeding Showtimes...');

        // 1. Get all movies
        const movies = await Movie.find();
        if (movies.length === 0) {
            console.log('No movies found. Please create movies first.');
            process.exit(0);
        }

        // 2. Create or Get Theaters
        let theater = await Theater.findOne({ name: 'PVR Cinemas' });
        if (!theater) {
            theater = await Theater.create({
                name: 'PVR Cinemas',
                city: 'Delhi',
                location: 'Select City Walk',
                screens: 5
            });
            console.log('Created Theater: PVR Cinemas');
        }

        // 3. Create Showtimes for each movie
        // Create 3 showtimes for each movie for Today and Tomorrow
        const showtimes = [];
        const now = new Date();
        const dates = [
            new Date(now), // Today
            new Date(now.setDate(now.getDate() + 1)) // Tomorrow
        ];

        for (const movie of movies) {
            for (const date of dates) {
                // Morning Show
                const morning = new Date(date);
                morning.setHours(10, 0, 0, 0);

                // Evening Show
                const evening = new Date(date);
                evening.setHours(18, 0, 0, 0);

                showtimes.push({
                    movie: movie._id,
                    theater: theater._id,
                    screen: '1',
                    startTime: morning,
                    price: 250,
                    totalSeats: 100,
                    seats: {},
                    bookedSeats: []
                });

                showtimes.push({
                    movie: movie._id,
                    theater: theater._id,
                    screen: '2',
                    startTime: evening,
                    price: 350,
                    totalSeats: 100,
                    seats: {},
                    bookedSeats: []
                });
            }
        }

        // Delete existing showtimes to avoid duplicates for clean testing
        await Showtime.deleteMany({});
        console.log('Cleared existing showtimes.');

        await Showtime.insertMany(showtimes);
        console.log(`Created ${showtimes.length} showtimes.`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedShowtimes();
