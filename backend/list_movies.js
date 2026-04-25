import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        const movies = await Movie.find({}, 'title image');
        console.log('--- Current Movies & Images ---');
        movies.forEach(m => console.log(`${m.title}: ${m.image}`));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
