import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Showtime from './models/Showtime.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        const count = await Showtime.countDocuments();
        console.log(`Showtimes count: ${count}`);
        if (count > 0) {
            const first = await Showtime.findOne().populate('movie');
            console.log('Sample Showtime:', JSON.stringify(first, null, 2));
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
