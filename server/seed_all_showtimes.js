import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';
import Showtime from './models/Showtime.js';
import Theater from './models/Theater.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Seeding showtimes for ALL movies...');

        // 1. Get or Create a default theater
        let theater = await Theater.findOne({ name: "Grand Cinema" });
        if (!theater) {
            theater = await Theater.create({
                name: "Grand Cinema",
                location: "Downtown",
                city: "Mumbai",
                screens: [
                    { name: "Screen 1", type: "Standard", capacity: 120 },
                    { name: "Screen 2", type: "Standard", capacity: 120 },
                    { name: "Screen 3", type: "Standard", capacity: 120 },
                    { name: "Screen 4", type: "IMAX", capacity: 200 },
                    { name: "Screen 5", type: "VIP", capacity: 60 }
                ]
            });
            console.log('Created default theater');
        }

        // 2. Get all movies
        const movies = await Movie.find({});
        console.log(`Found ${movies.length} movies.`);

        // 3. Create showtimes for each
        let addedCount = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const movie of movies) {
            // ALWAYS Clear existing showtimes for this movie to ensure fresh data
            await Showtime.deleteMany({ movie: movie._id });

            // Add showtimes for next 7 days (Dynamic Calendar)
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() + i);

                // 3 showtimes per day
                const times = [10, 13, 16, 19, 22]; // 10 AM, 1 PM, 4 PM, 7 PM, 10 PM

                for (const hour of times) {
                    const showTime = new Date(date);
                    showTime.setHours(hour, 0, 0, 0);

                    await Showtime.create({
                        movie: movie._id,
                        theater: theater._id,
                        screen: String(Math.floor(Math.random() * 5) + 1), // Random screen 1-5
                        startTime: showTime,
                        bookedSeats: [], // Reset seats
                        price: 200 + (Math.random() > 0.5 ? 50 : 0) // Random price 200 or 250
                    });
                    addedCount++;
                }
            }
            console.log(`Updated showtimes for: ${movie.title} (Next 7 days)`);
        }

        console.log(`\nSuccess! Added ${addedCount} new showtimes.`);
        process.exit(0);
    })
    .catch(err => {
        console.error("Seeding Error:", err.message); // Better error logging
        if (err.errors) {
            Object.keys(err.errors).forEach(key => {
                console.error(`- ${key}: ${err.errors[key].message}`);
            });
        }
        process.exit(1);
    });
