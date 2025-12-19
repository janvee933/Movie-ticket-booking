import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Starting bulk movie seed...');

        const movies = [
            // --- HOLLYWOOD (2020-2025) ---
            {
                title: "Spider-Man: No Way Home",
                genre: "Action/Sci-Fi",
                category: "Hollywood",
                rating: 8.2,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
                description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
                duration: 148,
                releaseDate: new Date("2021-12-17")
            },
            {
                title: "Top Gun: Maverick",
                genre: "Action/Drama",
                category: "Hollywood",
                rating: 8.3,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/2/22/Top_Gun_Maverick_poster.jpg",
                description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice.",
                duration: 130,
                releaseDate: new Date("2022-05-27")
            },
            {
                title: "Barbie",
                genre: "Adventure/Comedy",
                category: "Hollywood",
                rating: 7.0,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg",
                description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
                duration: 114,
                releaseDate: new Date("2023-07-21")
            },
            {
                title: "Deadpool & Wolverine",
                genre: "Action/Comedy",
                category: "Hollywood",
                rating: 8.1,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Deadpool_%26_Wolverine_poster.jpg/220px-Deadpool_%26_Wolverine_poster.jpg",
                description: "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.",
                duration: 127,
                releaseDate: new Date("2024-07-26")
            },
            {
                title: "Inside Out 2",
                genre: "Animation/Adventure",
                category: "Hollywood",
                rating: 7.8,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg",
                description: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust, who’ve been running a successful operation by all accounts, aren’t sure how to feel when Anxiety shows up.",
                duration: 96,
                releaseDate: new Date("2024-06-14")
            },
            {
                title: "Godzilla x Kong: The New Empire",
                genre: "Action/Sci-Fi",
                category: "Hollywood",
                rating: 6.5,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/b/be/Godzilla_x_kong_the_new_empire_poster.jpg",
                description: "Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island's mysteries.",
                duration: 115,
                releaseDate: new Date("2024-03-29")
            },

            // --- BOLLYWOOD (2020-2025) ---
            {
                title: "Pathaan",
                genre: "Action/Thriller",
                category: "Bollywood",
                rating: 5.9,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
                description: "An Indian agent runs a covert operation against a mercenary group headed by an embittered former agent who wants to attack India with a deadly virus.",
                duration: 146,
                releaseDate: new Date("2023-01-25")
            },
            {
                title: "Jawan",
                genre: "Action/Thriller",
                category: "Bollywood",
                rating: 7.0,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
                description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
                duration: 169,
                releaseDate: new Date("2023-09-07")
            },
            {
                title: "Animal",
                genre: "Action/Drama",
                category: "Bollywood",
                rating: 6.2,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
                description: "A son undergoes a remarkable transformation as the bond with his father begins to fracture, and he becomes consumed by a quest for vengeance.",
                duration: 201,
                releaseDate: new Date("2023-12-01")
            },
            {
                title: "Gadar 2",
                genre: "Action/Drama",
                category: "Bollywood",
                rating: 5.2,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/6/69/Gadar_2_film_poster.jpg",
                description: "Tara Singh returns to Pakistan to rescue his son Charanjeet Singh, who is imprisoned by the army general during the Indo-Pakistani War of 1971.",
                duration: 170,
                releaseDate: new Date("2023-08-11")
            },
            {
                title: "Stree 2",
                genre: "Comedy/Horror",
                category: "Bollywood",
                rating: 7.5,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/1/1a/Stree_2_poster.jpg",
                description: "The town of Chanderi is being haunted again. This time, women are mysteriously abducted by a headless entity known as 'Sarkata'. Once again, it's up to Vicky and his friends to save their town.",
                duration: 149,
                releaseDate: new Date("2024-08-15")
            },
            {
                title: "Shershaah",
                genre: "Biography/War",
                category: "Bollywood",
                rating: 8.3,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/9/93/Shershaah_film_poster.jpg",
                description: "The life of Indian Army captain Vikram Batra, awarded with the Param Vir Chakra, India's highest award for valour for his actions during the 1999 Kargil War.",
                duration: 135,
                releaseDate: new Date("2021-08-12")
            },
            {
                title: "Drishyam 2",
                genre: "Crime/Thriller",
                category: "Bollywood",
                rating: 8.2,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/d/dc/Drishyam_2_2022_film_poster.jpg",
                description: "Seven years after the case related to Vijay Salgaonkar and his family was closed, a series of unexpected events brings a truth to light that threatens to change everything for the Salgaonkars.",
                duration: 140,
                releaseDate: new Date("2022-11-18")
            },

            // --- TOLLYWOOD / SOUTH (2020-2025) ---
            {
                title: "RRR",
                genre: "Action/Drama",
                category: "Tollywood",
                rating: 7.8,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
                description: "A fearless warrior on a perilous mission comes face to face with a steely cop serving British forces in this epic saga set in pre-independent India.",
                duration: 187,
                releaseDate: new Date("2022-03-24")
            },
            {
                title: "K.G.F: Chapter 2",
                genre: "Action/Crime",
                category: "Tollywood",
                rating: 8.3,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
                description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.",
                duration: 168,
                releaseDate: new Date("2022-04-14")
            },
            {
                title: "Kantara",
                genre: "Action/Thriller",
                category: "Tollywood",
                rating: 8.2,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg",
                description: "When greed paves the way for betrayal, scheming, and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice.",
                duration: 148,
                releaseDate: new Date("2022-09-30")
            },
            {
                title: "Pushpa: The Rise",
                genre: "Action/Crime",
                category: "Tollywood",
                rating: 7.6,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg",
                description: "A labourer rises through the ranks of a red sandal smuggling syndicate, making some powerful enemies in the process.",
                duration: 179,
                releaseDate: new Date("2021-12-17")
            },
            {
                title: "Kalki 2898 AD",
                genre: "Sci-Fi/Action",
                category: "Tollywood",
                rating: 7.8,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kalki_2898_AD.jpg",
                description: "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
                duration: 180,
                releaseDate: new Date("2024-06-27")
            },
            {
                title: "Hanu-Man",
                genre: "Action/Fantasy",
                category: "Tollywood",
                rating: 7.9,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Hanu_Man_poster.jpg",
                description: "An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.",
                duration: 158,
                releaseDate: new Date("2024-01-12")
            },
            {
                title: "Devara: Part 1",
                genre: "Action/Drama",
                category: "Tollywood",
                rating: 6.8,
                trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
                image: "https://upload.wikimedia.org/wikipedia/en/5/50/Devara_Part_1_poster.jpg",
                description: "Devara, a fearless man from a coastal region, embarks on a perilous journey to protect his people.",
                duration: 170,
                releaseDate: new Date("2024-09-27")
            }
        ];

        let addedCount = 0;
        for (const movie of movies) {
            const exists = await Movie.findOne({ title: movie.title });
            if (!exists) {
                await Movie.create(movie);
                console.log(`[NEW] Added: ${movie.title}`);
                addedCount++;
            } else {
                console.log(`[SKIP] Already exists: ${movie.title}`);
                // Update image just in case
                await Movie.updateOne({ _id: exists._id }, { image: movie.image, trailerUrl: movie.trailerUrl });
            }
        }

        console.log(`\nSuccess! Added ${addedCount} new movies.`);
        process.exit(0);
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
