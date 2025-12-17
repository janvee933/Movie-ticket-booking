import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Improving existing movie posters...');

        const updates = [
            { title: "Baahubali 2: The Conclusion", image: "https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion.jpg" },
            { title: "Baahubali: The Beginning", image: "https://upload.wikimedia.org/wikipedia/en/5/51/Baahubali_The_Beginning_poster.jpg" },
            { title: "Vivah", image: "https://upload.wikimedia.org/wikipedia/en/7/77/Vivah_poster.jpg" },
            { title: "Om Shanti Om", image: "https://upload.wikimedia.org/wikipedia/en/0/0e/Om_Shanti_Om_poster.jpg" },
            { title: "Ek Tha Tiger", image: "https://upload.wikimedia.org/wikipedia/en/2/22/Ek_Tha_Tiger_poster.jpg" },
            { title: "3 Idiots", image: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg" },
            { title: "Dangal", image: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg" },
            { title: "Inception", image: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg" },
            { title: "Interstellar", image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg" },
            { title: "The Dark Knight", image: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg" },
            { title: "Avengers: Endgame", image: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg" },
            { title: "Spider-Man: Across the Spider-Verse", image: "https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg" }
        ];

        for (const update of updates) {
            const res = await Movie.updateOne({ title: update.title }, { image: update.image });
            if (res.matchedCount > 0) {
                console.log(`Updated poster for: ${update.title}`);
            } else {
                console.log(`Movie not found: ${update.title}`);
            }
        }

        console.log('Poster improvement complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
