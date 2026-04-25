import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';
import { movies } from '../src/data/movies.js'; // Importing from frontend data source

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Connected to MongoDB. Syncing movies...');

        for (const movieData of movies) {
            // Check if movie exists by title
            const existingMovie = await Movie.findOne({ title: movieData.title });

            if (existingMovie) {
                // Update existing movie
                existingMovie.image = movieData.image;
                existingMovie.rating = movieData.rating;
                existingMovie.genre = movieData.genre;
                existingMovie.category = movieData.category;
                existingMovie.description = movieData.description;
                existingMovie.trailerUrl = movieData.trailerUrl;
                await existingMovie.save();
                console.log(`Updated: ${movieData.title}`);
            } else {
                // Create new movie
                await Movie.create(movieData);
                console.log(`Created: ${movieData.title}`);
            }
        }

        console.log('Sync complete.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
        mongoose.connection.close();
    });
