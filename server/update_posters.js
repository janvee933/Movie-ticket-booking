import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Connected to DB. Updating posters...');

        const posterMap = {
            "K.G.F: Chapter 2": "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
            "RRR": "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
            "Brahmastra": "https://upload.wikimedia.org/wikipedia/en/4/40/Brahmastra_Part_One_Shiva.jpg",
            "Pushpa: The Rise": "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg",
            "Dune: Part Two": "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two.jpg",
            "Oppenheimer": "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg",
            "Tiger 3": "https://upload.wikimedia.org/wikipedia/en/d/d9/Tiger_3_poster.jpg",
            "Dunki": "https://upload.wikimedia.org/wikipedia/en/d/d1/Dunki_poster.jpg",
            "Jawan": "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
            "Pathaan": "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
            "Animal": "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
            "Sam Bahadur": "https://upload.wikimedia.org/wikipedia/en/6/62/Sam_Bahadur_film_poster.jpg",
            "Fighter": "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_teaser.jpg"
        };

        for (const [title, url] of Object.entries(posterMap)) {
            const res = await Movie.updateOne(
                { title: { $regex: new RegExp(title, 'i') } }, // Case insensitive partial match
                { $set: { image: url } }
            );
            if (res.matchedCount > 0) {
                console.log(`Updated: ${title}`);
            } else {
                console.log(`Skipped (Not Found): ${title}`);
            }
        }

        console.log('Poster update complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
