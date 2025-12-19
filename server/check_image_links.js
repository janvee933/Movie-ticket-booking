import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Checking image links...');
        const movies = await Movie.find({});

        let brokenCount = 0;

        for (const m of movies) {
            if (!m.image) {
                console.log(`[MISSING] ${m.title}`);
                continue;
            }

            try {
                const res = await fetch(m.image, { method: 'HEAD' });
                if (!res.ok) {
                    console.log(`[BROKEN ${res.status}] ${m.title} -> ${m.image}`);
                    brokenCount++;
                }
            } catch (error) {
                console.log(`[ERROR] ${m.title} -> ${error.message}`);
                brokenCount++;
            }
        }

        console.log(`\nFound ${brokenCount} broken links out of ${movies.length}.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
