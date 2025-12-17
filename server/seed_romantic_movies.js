import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Adding romantic movies...');

        const romanticMovies = [
            // --- BOLLYWOOD ---
            {
                title: "Dilwale Dulhania Le Jayenge",
                genre: "Romance/Drama",
                category: "Bollywood",
                rating: 9.0,
                image: "https://upload.wikimedia.org/wikipedia/en/8/80/Dilwale_Dulhania_Le_Jayenge_poster.jpg",
                description: "Raj and Simran meet on a trip to Europe and fall in love. However, Simran is destined to marry another man back in India. Raj follows her to India to win her hand and her father's approval.",
                duration: 189,
                releaseDate: new Date("1995-10-20")
            },
            {
                title: "Jab We Met",
                genre: "Romance/Comedy",
                category: "Bollywood",
                rating: 8.5,
                image: "https://upload.wikimedia.org/wikipedia/en/9/9f/Jab_We_Met_Poster.jpg",
                description: "A depressed wealthy businessman finds his life changing after he meets a spunky and care-free young woman on a train.",
                duration: 138,
                releaseDate: new Date("2007-10-26")
            },
            {
                title: "Rocky Aur Rani Kii Prem Kahaani",
                genre: "Romance/Comedy",
                category: "Bollywood",
                rating: 7.0,
                image: "https://upload.wikimedia.org/wikipedia/en/6/65/Rocky_Aur_Rani_Ki_Prem_Kahaani_poster.jpg",
                description: "Flamboyant Rocky and intellectual Rani fall in love, but their vastly different families disapprove. They decide to live with each other's families for three months before getting married.",
                duration: 168,
                releaseDate: new Date("2023-07-28")
            },
            {
                title: "Aashiqui 2",
                genre: "Romance/Musical",
                category: "Bollywood",
                rating: 7.5,
                image: "https://upload.wikimedia.org/wikipedia/en/f/f3/Aashiqui_2_poster.jpg",
                description: "Rahul loses his fans and fame due to alcoholism, but he then decides to turn a small time singer into a rising star.",
                duration: 132,
                releaseDate: new Date("2013-04-26")
            },

            // --- HOLLYWOOD ---
            {
                title: "Titanic",
                genre: "Romance/Drama",
                category: "Hollywood",
                rating: 9.2,
                image: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png",
                description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
                duration: 195,
                releaseDate: new Date("1997-12-19")
            },
            {
                title: "The Notebook",
                genre: "Romance/Drama",
                category: "Hollywood",
                rating: 8.8,
                image: "https://upload.wikimedia.org/wikipedia/en/8/86/Posternotebook.jpg",
                description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
                duration: 123,
                releaseDate: new Date("2004-06-25")
            },
            {
                title: "La La Land",
                genre: "Romance/Musical",
                category: "Hollywood",
                rating: 8.5,
                image: "https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png",
                description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
                duration: 128,
                releaseDate: new Date("2016-12-09")
            },

            // --- TOLLYWOOD / SOUTH ---
            {
                title: "Sita Ramam",
                genre: "Romance/Drama",
                category: "Tollywood",
                rating: 8.6,
                image: "https://upload.wikimedia.org/wikipedia/en/0/00/Sita_Ramam.jpg",
                description: "An orphan soldier, Lieutenant Ram's life changes, after he gets a letter from a girl named Sita. He meets her and love blossoms between them. When he comes back to his camp in Kashmir, he sends a letter to Sita which won't reach her.",
                duration: 163,
                releaseDate: new Date("2022-08-05")
            },
            {
                title: "Hi Nanna",
                genre: "Romance/Drama",
                category: "Tollywood",
                rating: 8.3,
                image: "https://upload.wikimedia.org/wikipedia/en/b/b5/Hi_Nanna_poster.jpg",
                description: "A doting father and his 6-year-old daughter find their lives taking a dramatic turn when the woman he loves marries someone else and a stranger enters their world.",
                duration: 155,
                releaseDate: new Date("2023-12-07")
            },
            {
                title: "Geetha Govindam",
                genre: "Romance/Comedy",
                category: "Tollywood",
                rating: 7.7,
                image: "https://upload.wikimedia.org/wikipedia/en/2/23/Geetha_Govindam_poster.jpg",
                description: "An innocent young lecturer is misunderstood as a pervert and despised by a woman who co-incidentally turns out to be the younger sister of his brother-in-law.",
                duration: 142,
                releaseDate: new Date("2018-08-15")
            }
        ];

        let addedCount = 0;
        for (const movie of romanticMovies) {
            const exists = await Movie.findOne({ title: movie.title });
            if (!exists) {
                await Movie.create(movie);
                console.log(`[NEW] Added: ${movie.title}`);
                addedCount++;
            } else {
                console.log(`[SKIP] Already exists: ${movie.title}`);
                // Update image just in case to ensure high quality
                await Movie.updateOne({ _id: exists._id }, { image: movie.image });
            }
        }

        console.log(`\nSuccess! Added ${addedCount} romantic movies.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
