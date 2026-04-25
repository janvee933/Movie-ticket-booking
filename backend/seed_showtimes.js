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
        await Theater.deleteMany({});
        await Showtime.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Get all movies
        const movies = await Movie.find();
        if (movies.length === 0) {
            console.log('No movies found. Please create movies first.');
            process.exit(0);
        }

        // 2. Create or Get Theaters
        const theatersData = [
            {
                name: 'PVR Cinemas',
                city: 'Delhi',
                location: 'Select City Walk',
                screens: [
                    { name: '1', type: 'Standard', capacity: 80, rows: 8, cols: 10 },
                    { name: '2', type: 'Standard', capacity: 80, rows: 8, cols: 10 },
                    { name: '3', type: 'Standard', capacity: 80, rows: 8, cols: 10 },
                    { name: '4', type: 'IMAX', capacity: 80, rows: 8, cols: 10 },
                    { name: '5', type: 'VIP', capacity: 40, rows: 5, cols: 8 }
                ]
            },
            {
                name: 'INOX',
                city: 'Mumbai',
                location: 'Nariman Point',
                screens: [
                    { name: 'Screen 1', type: 'Standard', capacity: 100, rows: 10, cols: 10 },
                    { name: 'Screen 2', type: 'INSIGNIA', capacity: 30, rows: 5, cols: 6 }
                ]
            },
            {
                name: 'Cinepolis',
                city: 'Bengaluru',
                location: 'Koramangala',
                screens: [
                    { name: '1', type: 'Standard', capacity: 120, rows: 10, cols: 12 },
                    { name: 'IMAX', type: 'IMAX', capacity: 150, rows: 10, cols: 15 }
                ]
            },
            {
                name: 'Carnival Cinemas',
                city: 'Kolkata',
                location: 'Salt Lake',
                screens: [
                    { name: 'Audi 1', type: 'Standard', capacity: 200, rows: 10, cols: 20 }
                ]
            },
            {
                name: 'Miraj Cinemas',
                city: 'Jaipur',
                location: 'Pink City Mall',
                screens: [
                    { name: '1', type: 'Standard', capacity: 100, rows: 10, cols: 10 }
                ]
            }
        ];

        const createdTheaters = await Theater.insertMany(theatersData);
        console.log(`Created ${createdTheaters.length} Theaters`);

        const mainTheater = createdTheaters[0]; // Use any theater for initial showtimes

        // 3. Create Showtimes for each movie
        // Create 3 showtimes for each movie for Today and Tomorrow
        const showtimes = [];
        const now = new Date();
        const dates = [
            new Date(now), // Today
            new Date(now.setDate(now.getDate() + 1)) // Tomorrow
        ];

        for (let i = 0; i < movies.length; i++) {
            const movie = movies[i];
            // Assign each movie to a distinct theater (cycling through 5 theaters)
            const theater = createdTheaters[i % createdTheaters.length];
            
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
                    screen: theater.screens[0].name,
                    startTime: morning,
                    price: 250,
                    totalSeats: theater.screens[0].capacity,
                    seats: {},
                    bookedSeats: []
                });

                showtimes.push({
                    movie: movie._id,
                    theater: theater._id,
                    screen: theater.screens[1]?.name || theater.screens[0].name,
                    startTime: evening,
                    price: 350,
                    totalSeats: theater.screens[1]?.capacity || theater.screens[0].capacity,
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
