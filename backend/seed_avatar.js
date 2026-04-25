import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

const movies = [
    {
        title: "Avatar",
        genre: "Sci-Fi, Action, Adventure",
        category: "Hollywood",
        originalPrice: 250,
        rating: 4.8,
        image: "https://image.tmdb.org/t/p/original/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
        duration: 162,
        releaseDate: new Date("2009-12-18"),
        trailerUrl: "https://www.youtube.com/embed/5PSNL1qE6VY"
    },
    {
        title: "Avatar: The Way of Water",
        genre: "Sci-Fi, Action, Adventure",
        category: "Hollywood",
        originalPrice: 300,
        rating: 4.7,
        image: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        duration: 192,
        releaseDate: new Date("2022-12-16"),
        trailerUrl: "https://www.youtube.com/embed/d9MyqF3bPhI"
    },
    {
        title: "Avatar: Fire and Ash",
        genre: "Sci-Fi, Action, Adventure",
        category: "Hollywood",
        originalPrice: 350,
        rating: 0, // Upcoming
        image: "https://upload.wikimedia.org/wikipedia/en/3/30/Avatar_Fire_and_Ash_poster.jpg", // Wiki poster or placeholder
        description: "The third installment in the Avatar franchise. Jake Sully and Neytiri encounter the Ash People, a clan of aggressive Na'vi who live in volcanic regions.",
        duration: 0,
        releaseDate: new Date("2025-12-19"),
        trailerUrl: "https://www.youtube.com/embed/a8Gx8wiNbs8" // Concept/Teaser
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Seeding Avatar movies...');

        for (const movie of movies) {
            const existing = await Movie.findOne({
                title: { $regex: new RegExp(movie.title.split(':')[0], 'i') } // Match by "Avatar" or main part
            });

            // Specific check to distinguish Avatar 1, 2, 3 so we don't overwrite each other with loose regex
            const exactMatch = await Movie.findOne({ title: movie.title });

            if (exactMatch) {
                console.log(`[UPDATED] ${movie.title}`);
                await Movie.updateOne({ _id: exactMatch._id }, { $set: movie });
            } else {
                console.log(`[CREATED] ${movie.title}`);
                await Movie.create(movie);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
