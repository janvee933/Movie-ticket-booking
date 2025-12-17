import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Adding new movies...');

        const newMovies = [
            {
                title: "Avatar: The Way of Water",
                genre: "Sci-Fi/Adventure",
                category: "Hollywood",
                rating: 8.5,
                image: "https://upload.wikimedia.org/wikipedia/en/5/54/Avatar_The_Way_of_Water_poster.jpg",
                description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
                duration: 192,
                releaseDate: new Date("2022-12-16")
            },
            {
                title: "The Batman",
                genre: "Action/Crime",
                category: "Hollywood",
                rating: 8.0,
                image: "https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg",
                description: "When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
                duration: 176,
                releaseDate: new Date("2022-03-04")
            },
            {
                title: "Leo",
                genre: "Action/Thriller",
                category: "Bollywood",
                rating: 7.5,
                image: "https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg",
                description: "Things go awry for a mild-mannered café owner, who becomes a local hero through an act of violence, alerting a drug cartel to his existence and questioning his identity.",
                duration: 164,
                releaseDate: new Date("2023-10-19")
            },
            {
                title: "12th Fail",
                genre: "Drama/Biography",
                category: "Bollywood",
                rating: 9.2,
                image: "https://upload.wikimedia.org/wikipedia/en/f/f2/12th_Fail_poster.jpeg",
                description: "The real-life story of IPS Officer Manoj Kumar Sharma and IRS Officer Shraddha Joshi.",
                duration: 147,
                releaseDate: new Date("2023-10-27")
            },
            {
                title: "Salaar: Part 1 - Ceasefire",
                genre: "Action/Drama",
                category: "Bollywood",
                rating: 7.0,
                image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Salaar_Part_1_%E2%80%93_Ceasefire.jpg",
                description: "A gang leader makes a promise to a dying friend and takes on other criminal gangs.",
                duration: 175,
                releaseDate: new Date("2023-12-22")
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
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
