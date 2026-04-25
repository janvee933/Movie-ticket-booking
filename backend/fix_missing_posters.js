import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Updating specific missing posters...');

        const updates = {
            "Ek Tha Tiger": "https://upload.wikimedia.org/wikipedia/en/3/36/Ek_Tha_Tiger_theatrical_poster.jpg",
            "Stree 2": "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/stree-2-et00364249-1721725490.jpg",
            "Aashiqui 2": "https://upload.wikimedia.org/wikipedia/en/d/de/Aashiqui_2_poster.jpg",
            "Dune: Part Two": "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg"
        };

        for (const [title, url] of Object.entries(updates)) {
            const res = await Movie.updateOne(
                { title: { $regex: new RegExp(title, 'i') } },
                { $set: { image: url } }
            );

            if (res.matchedCount > 0) {
                console.log(`[UPDATED] ${title}`);
            } else {
                console.log(`[NOT FOUND] ${title}`);
            }
        }

        console.log('Update complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
