import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

const extraMovies = [
    {
        title: 'War',
        genre: 'Action, Thriller',
        category: 'Bollywood',
        description: 'An Indian soldier is assigned to eliminate his former mentor and he must keep his wits about him if he is to be successful in his mission. When the two men collide, it results in a barrage of battles and bullets.',
        rating: 6.5,
        releaseDate: '2019-10-02',
        image: 'https://upload.wikimedia.org/wikipedia/en/6/6f/War_official_poster.jpg'
    },
    {
        title: 'Kabir Singh',
        genre: 'Romance, Drama',
        category: 'Bollywood',
        description: 'Kabir Singh is a remake of a Telugu movie Arjun Reddy (2017), where a short-tempered house surgeon gets used to drugs and drinks when his girlfriend is forced to marry another person.',
        rating: 7.1,
        releaseDate: '2019-06-21',
        image: 'https://upload.wikimedia.org/wikipedia/en/d/dc/Kabir_Singh.jpg'
    },
    {
        title: 'Zindagi Na Milegi Dobara',
        genre: 'Comedy, Drama',
        category: 'Bollywood',
        description: 'Three friends decide to turn their fantasy vacation into reality after one of their number becomes engaged.',
        rating: 8.2,
        releaseDate: '2011-07-15',
        image: 'https://upload.wikimedia.org/wikipedia/en/3/3d/Zindaginamilegidobara.jpg'
    },
    {
        title: 'Sanju',
        genre: 'Biography, Drama',
        category: 'Bollywood',
        description: 'Sanju is a biopic of the controversial life of actor Sanjay Dutt: his film career, jail sentence and personal life.',
        rating: 7.6,
        releaseDate: '2018-06-29',
        image: 'https://upload.wikimedia.org/wikipedia/en/6/68/Sanju_-_Theatrical_Poster.jpeg'
    },
    {
        title: 'Bajrangi Bhaijaan',
        genre: 'Action, Comedy, Drama',
        category: 'Bollywood',
        description: 'A man with a magnanimous heart takes a young mute Pakistani girl back to her homeland to reunite her with her family.',
        rating: 8.1,
        releaseDate: '2015-07-17',
        image: 'https://upload.wikimedia.org/wikipedia/en/d/dd/Bajrangi_Bhaijaan_Poster.jpg'
    },
    {
        title: 'PK',
        genre: 'Comedy, Drama, Sci-Fi',
        category: 'Bollywood',
        description: 'An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.',
        rating: 8.1,
        releaseDate: '2014-12-19',
        image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg'
    },
    {
        title: 'Sultan',
        genre: 'Action, Drama, Sport',
        category: 'Bollywood',
        description: 'Sultan is a classic underdog tale about a wrestler\'s journey, looking for a comeback by defeating all odds staked up against him.',
        rating: 7.0,
        releaseDate: '2016-07-06',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Sultan_film_poster.jpg'
    },
    {
        title: 'Chennai Express',
        genre: 'Action, Adventure, Comedy',
        category: 'Bollywood',
        description: 'A man heading towards Rameshwaram via Chennai express to immerse his late grandfather\'s ashes unwillingly gets caught amongst goons after helping their boss\'s daughter and them board the train.',
        rating: 6.1,
        releaseDate: '2013-08-08',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Chennai_Express.jpg'
    },
    {
        title: 'Yeh Jawaani Hai Deewani',
        genre: 'Drama, Musical, Romance',
        category: 'Bollywood',
        description: 'Kabir and Naina meet during a trekking trip where she falls in love with him but refrains from expressing it. They drift apart but end up meeting at a friend\'s wedding.',
        rating: 7.2,
        releaseDate: '2013-05-31',
        image: 'https://upload.wikimedia.org/wikipedia/en/1/15/Yeh_Jawaani_Hai_Deewani.jpg'
    },
    {
        title: 'Uri: The Surgical Strike',
        genre: 'Action, Drama, History',
        category: 'Bollywood',
        description: 'Indian army special forces execute a covert operation, avenging the killing of fellow army men at their base by a terrorist group.',
        rating: 8.2,
        releaseDate: '2019-01-11',
        image: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Uri_The_Surgical_Strike_poster.jpg'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Seeding extra hit movies...');

        for (const movie of extraMovies) {
            // Check link validity (simple HEAD request)
            try {
                const res = await fetch(movie.image, { method: 'HEAD' });
                if (!res.ok) {
                    console.log(`[Broken Link] ${movie.title} - ${movie.image}`);
                    // Fallback to TBA or skip? For now we keep it but warn.
                }
            } catch (e) {
                console.log(`[Link Error] ${movie.title} - ${e.message}`);
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

        console.log('Extra seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
