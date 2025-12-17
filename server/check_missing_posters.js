import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        // Find movies where image is null, empty string, or doesn't start with http
        const incompleteMovies = await Movie.find({
            $or: [
                { image: { $exists: false } },
                { image: null },
                { image: "" },
                { image: "TBA" } // Common placeholder
            ]
        });

        console.log(`Found ${incompleteMovies.length} movies with missing posters.`);
        incompleteMovies.forEach(m => console.log(`- ${m.title}`));

        // fs imported at top

        // Find all movies
        const allMovies = await Movie.find({});

        let output = "--- Movie List & Poster Status ---\n";
        let missingCount = 0;

        for (const m of allMovies) {
            let status = "OK";
            if (!m.image || m.image.length < 10 || m.image === "TBA") {
                status = "MISSING";
                missingCount++;
            }
            output += `[${status}] ${m.title} || ${m.image}\n`;
        }

        output += `\nTotal Movies: ${allMovies.length}\n`;
        output += `Total Missing info: ${missingCount}\n`;

        fs.writeFileSync('movie_list.txt', output);
        console.log('List written to movie_list.txt');

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
