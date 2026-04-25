import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Adding new hit movies...');

        const newMovies = [
            {
                title: "Deadpool & Wolverine",
                genre: "Action/Comedy",
                category: "Hollywood",
                rating: 4.8,
                trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
                image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Deadpool_%26_Wolverine_poster.jpg/220px-Deadpool_%26_Wolverine_poster.jpg",
                description: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.",
                duration: 127,
                releaseDate: new Date("2024-07-26")
            },
            {
                title: "Kalki 2898 AD",
                genre: "Sci-Fi/Action",
                category: "Tollywood",
                rating: 4.7,
                trailerUrl: "https://www.youtube.com/embed/k8K6216Xv3g",
                image: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
                description: "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
                duration: 181,
                releaseDate: new Date("2024-06-27")
            },
            {
                title: "Fighter",
                genre: "Action/Thriller",
                category: "Bollywood",
                rating: 4.5,
                trailerUrl: "https://www.youtube.com/embed/9h30g84e03U",
                image: "https://upload.wikimedia.org/wikipedia/en/d/df/Fighter_film_poster.jpg",
                description: "Top aviators of the IAF come together in the face of imminent danger, forming Air Dragons. Fighter unfolds their camaraderie, brotherhood and battles, internal and external.",
                duration: 166,
                releaseDate: new Date("2024-01-25")
            },
            {
                title: "Kung Fu Panda 4",
                genre: "Animation",
                category: "Hollywood",
                rating: 4.6,
                trailerUrl: "https://www.youtube.com/embed/_inKs4eeHiI",
                image: "https://upload.wikimedia.org/wikipedia/en/7/7f/Kung_Fu_Panda_4_poster.jpg",
                description: "Po must train a new warrior when he's chosen to become the spiritual leader of the Valley of Peace. However, when a powerful shape-shifting sorceress sets her eyes on his Staff of Wisdom, he suddenly realizes he's going to need some help.",
                duration: 94,
                releaseDate: new Date("2024-03-08")
            },
            {
                title: "Shaitaan",
                genre: "Horror/Thriller",
                category: "Bollywood",
                rating: 4.4,
                trailerUrl: "https://www.youtube.com/embed/K30s3tS2a7w",
                image: "https://upload.wikimedia.org/wikipedia/en/c/caca/Shaitaan_2024_film_poster.jpg",
                description: "A timeless tale of battle between good and evil with a family embodying the forces of righteousness while a man symbolizes malevolence.",
                duration: 132,
                releaseDate: new Date("2024-03-08")
            }
        ];

        for (const movie of newMovies) {
            // Check if exists to avoid duplicates
            const exists = await Movie.findOne({ title: movie.title });
            if (!exists) {
                await Movie.create(movie);
                console.log(`Added: ${movie.title}`);
            } else {
                console.log(`Skipped (Already exists): ${movie.title}`);
                await Movie.updateOne({ _id: exists._id }, movie); // Update details if exists
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
