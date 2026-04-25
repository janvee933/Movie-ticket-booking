import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

const franchises = [
    // --- SPIDER-MAN (TOBEY MAGUIRE) ---
    {
        title: 'Spider-Man',
        genre: 'Action, Sci-Fi',
        category: 'Hollywood',
        description: 'When bitten by a genetically modified spider, a nerdy, shy, and awkward high school student gains spider-like abilities that he eventually must use to fight evil as a superhero after tragedy befalls his family.',
        rating: 7.4,
        releaseDate: '2002-05-03',
        image: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Spider-Man2002Poster.jpg'
    },
    {
        title: 'Spider-Man 2',
        genre: 'Action, Sci-Fi',
        category: 'Hollywood',
        description: 'Peter Parker is beset with troubles in his failing personal life as he battles a brilliant scientist named Doctor Otto Octavius.',
        rating: 7.5,
        releaseDate: '2004-06-30',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/02/Spider-Man_2_Poster.jpg'
    },
    {
        title: 'Spider-Man 3',
        genre: 'Action, Sci-Fi',
        category: 'Hollywood',
        description: 'A strange black entity from another world bonds with Peter Parker and causes inner turmoil as he contends with new villains, temptations, and revenge.',
        rating: 6.3,
        releaseDate: '2007-05-04',
        image: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Spider-Man_3%2C_International_Poster.jpg'
    },

    // --- AMAZING SPIDER-MAN (ANDREW GARFIELD) ---
    {
        title: 'The Amazing Spider-Man',
        genre: 'Action, Sci-Fi',
        category: 'Hollywood',
        description: 'After Peter Parker is bitten by a genetically altered spider, he gains newfound, spider-like powers and ventures out to save the city from the machinations of a mysterious reptilian foe.',
        rating: 6.9,
        releaseDate: '2012-07-03',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/0c/The_Amazing_Spider-Man_theatrical_poster.jpeg'
    },
    {
        title: 'The Amazing Spider-Man 2',
        genre: 'Action, Sci-Fi',
        category: 'Hollywood',
        description: 'When New York is put under siege by Oscorp, it is up to Spider-Man to save the city he swore to protect as well as his loved ones.',
        rating: 6.6,
        releaseDate: '2014-05-02',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/02/The_Amazing_Spider-Man_2_poster.jpg'
    },

    // --- MCU SPIDER-MAN (TOM HOLLAND) ---
    {
        title: 'Spider-Man: Homecoming',
        genre: 'Action, Sci-Fi, Teen',
        category: 'Hollywood',
        description: 'Peter Parker balances his life as an ordinary high school student in Queens with his superhero alter-ego Spider-Man, and finds himself on the trail of a new menace prowling the skies of New York City.',
        rating: 7.4,
        releaseDate: '2017-07-07',
        image: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Spider-Man_Homecoming_poster.jpg'
    },
    {
        title: 'Spider-Man: Far From Home',
        genre: 'Action, Sci-Fi, Teen',
        category: 'Hollywood',
        description: 'Following the events of Avengers: Endgame (2019), Spider-Man must step up to take on new threats in a world that has changed forever.',
        rating: 7.4,
        releaseDate: '2019-07-02',
        image: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Spider-Man_Far_From_Home_poster.jpg'
    },
    {
        title: 'Spider-Man: No Way Home',
        genre: 'Action, Sci-Fi, Fantasy',
        category: 'Hollywood',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
        rating: 8.2,
        releaseDate: '2021-12-17',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg'
    },

    // --- STREE FRANCHISE ---
    {
        title: 'Stree',
        genre: 'Comedy, Horror',
        category: 'Bollywood',
        description: 'In the small town of Chanderi, the men live in fear of an evil spirit named "Stree" who abducts men in the night during festivals.',
        rating: 7.5,
        releaseDate: '2018-08-31',
        image: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Stree_poster.jpg'
    },
    {
        title: 'Stree 2',
        genre: 'Comedy, Horror',
        category: 'Bollywood',
        description: 'A headless monster named Sarkata terrorizes the town of Chanderi, abducting progressive women. It\'s up to Vicky and his friends to save the town again.',
        rating: 7.8,
        releaseDate: '2024-08-15',
        // Note: This relies on Stree 2 being present in locally uploaded assets (from previous steps). 
        // If not, it won't break anything, just won't update the image if the local file is missing.
        // But we will try to set it to a known path if it exists in DB already.
        image: 'TBA'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Seeding franchises (Spider-Man & Stree)...');

        for (const movie of franchises) {
            // Check link validity for external URLs
            if (movie.image.startsWith('http')) {
                try {
                    const res = await fetch(movie.image, { method: 'HEAD' });
                    // Wiki images might return 403 on HEAD but work in <img> tags due to referrer policies, 
                    // but usually upload.wikimedia.org is fine. We'll proceed regardless but log warning.
                    if (!res.ok) console.log(`[Link Check] ${movie.title}: ${res.status}`);
                } catch (e) {
                    // ignore
                }
            } else if (movie.title === 'Stree 2') {
                // Special handling for Stree 2: 
                // We don't want to overwrite a valid local image with 'TBA'.
                // We only create if missing, or update metadata but keep image if it's already good.
                const existing = await Movie.findOne({ title: /Stree 2/i });
                if (existing && existing.image && existing.image.includes('uploads')) {
                    movie.image = existing.image; // Keep existing local image
                } else {
                    movie.image = 'https://upload.wikimedia.org/wikipedia/en/1/1a/Stree_2_poster.jpg'; // Fallback
                }
            }

            const regex = new RegExp(movie.title.replace(/[:\-]/g, '.?'), 'i');
            const existing = await Movie.findOne({ title: { $regex: regex } });

            if (existing) {
                await Movie.updateOne({ _id: existing._id }, { $set: movie });
                console.log(`[UPDATED] ${movie.title}`);
            } else {
                await Movie.create(movie);
                console.log(`[CREATED] ${movie.title}`);
            }
        }

        console.log('Franchise seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
