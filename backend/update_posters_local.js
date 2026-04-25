import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Updating poster images to local uploads...');

        const updates = {
            "Deadpool & Wolverine": "http://localhost:5000/uploads/deadpool.png",
            "Kalki 2898 AD": "http://localhost:5000/uploads/kalki.png",
            "Fighter": "http://localhost:5000/uploads/fighter.png",
            "Kung Fu Panda 4": "http://localhost:5000/uploads/panda.png",
            "Shaitaan": "http://localhost:5000/uploads/shaitaan.png"
        };

        for (const [title, url] of Object.entries(updates)) {
            const result = await Movie.updateOne({ title: title }, { image: url });
            if (result.matchedCount > 0) {
                console.log(`Updated: ${title}`);
            } else {
                console.log(`Not Check: ${title}`);
            }
        }

        console.log('Update complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
