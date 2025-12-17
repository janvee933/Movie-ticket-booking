import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Showtime from './models/Showtime.js';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        // Pick a movie, e.g., "Avatar: The Way of Water" or random
        const movie = await Movie.findOne({ title: "Avatar: The Way of Water" });

        if (!movie) {
            console.log("Movie 'Avatar: The Way of Water' not found. Picking random...");
            const randomMovie = await Movie.findOne();
            if (randomMovie) {
                console.log(`Checking showtimes for: ${randomMovie.title}`);
                const shows = await Showtime.find({ movie: randomMovie._id });
                console.log(`count: ${shows.length}`);
                console.log(JSON.stringify(shows, null, 2));
            } else {
                console.log("No movies found in DB");
            }
        } else {
            console.log(`Checking showtimes for: ${movie.title} (${movie._id})`);
            const shows = await Showtime.find({ movie: movie._id });
            console.log(`Found ${shows.length} showtimes.`);
            if (shows.length > 0) {
                console.log("Sample Show:", JSON.stringify(shows[0], null, 2));
            }
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
