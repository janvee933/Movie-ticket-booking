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
            // Check if movie already has showtimes for today/tomorrow
            const existingShows = await Showtime.find({ movie: movie._id });

            if (existingShows.length === 0) {
                // Add showtimes for next 3 days
                for (let i = 0; i < 3; i++) {
                    const date = new Date(today);
                    date.setDate(date.getDate() + i);

                    // 3 showtimes per day
                    const times = [10, 14, 19]; // 10 AM, 2 PM, 7 PM

                    for (const hour of times) {
                        const showTime = new Date(date);
                        showTime.setHours(hour, 0, 0, 0);

                        await Showtime.create({
                            movie: movie._id,
                            theater: theater._id,
                            screen: String(Math.floor(Math.random() * 5) + 1),
                            startTime: showTime, // totalSeats removed as it's not in schema
                            bookedSeats: [],
                            price: 200
                        });
                        addedCount++;
                    }
                }
                console.log(`Added showtimes for: ${movie.title}`);
            }
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
