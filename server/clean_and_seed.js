import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';
import Showtime from './models/Showtime.js';
import Theater from './models/Theater.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Cleaning up and seeding showtimes...');

        // 1. Delete problematic theater if exists
        await Theater.deleteMany({ name: "Grand Cinema" });
        console.log("Deleted old 'Grand Cinema' records.");

        // 2. Create Theater fresh
        const theater = await Theater.create({
            name: "Grand Cinema",
            location: "Downtown",
            city: "Mumbai",
            screens: [] // Simplest VALID array
        });
        console.log('Created new default theater (Mumbai).');

        // 3. Get all movies
        const movies = await Movie.find({});
        console.log(`Found ${movies.length} movies.`);

        // 4. Create showtimes
        let addedCount = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const movie of movies) {
            // Check existing shows (optional: maybe verify they are valid?)
            const existingShows = await Showtime.find({ movie: movie._id });

            if (existingShows.length === 0) {
                // Add showtimes for next 3 days
                for (let i = 0; i < 3; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() + i);

                    // 3 showtimes per day
                    const times = [10, 14, 19];

                    for (const hour of times) {
                        const showTime = new Date(date);
                        showTime.setHours(hour, 0, 0, 0);

                        await Showtime.create({
                            movie: movie._id,
                            theater: theater._id,
                            screen: "1", // Simple String
                            startTime: showTime,
                            bookedSeats: [],
                            price: 200
                        });
                        addedCount++;
                    }
                }
                // Only log every 5th movie to reduce noise
                if (addedCount % 15 === 0) console.log(`Seeding... (${addedCount} shows added)`);
            }
        }

        console.log(`\nSuccess! Added ${addedCount} new showtimes.`);
        process.exit(0);
    })
    .catch(err => {
        console.error("Clean Seed Error:", err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`- ${key}: ${err.errors[key].message}`);
            });
        }
        process.exit(1);
    });
