import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

// Metadata for the movies to be added/updated
const hitMovies = [
    {
        title: 'Baahubali: The Beginning',
        genre: 'Action, Drama',
        category: 'Tollywood',
        description: 'In the kingdom of Mahishmati, while pursuing his love, Shivudu learns about the apparent brutal conflict of his family and his legacy.',
        image: 'http://localhost:5000/uploads/baahubali.jpg',
        rating: 8.0,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2015-07-10'
    },
    {
        title: 'Baahubali 2: The Conclusion',
        genre: 'Action, Drama',
        category: 'Tollywood',
        description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
        image: 'http://localhost:5000/uploads/baahubali_2.jpg',
        rating: 8.2,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2017-04-28'
    },
    {
        title: 'Dunki',
        genre: 'Comedy, Drama',
        category: 'Bollywood',
        description: 'Hardy and his friends from a picturesque village in Punjab embark on a difficult journey to reach London to fulfill their dreams.',
        image: 'http://localhost:5000/uploads/dunki.jpg',
        rating: 7.2,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-12-21'
    },
    {
        title: 'Vivah',
        genre: 'Romance, Drama',
        category: 'Bollywood',
        description: 'Prem and Poonam fall in love and are due to marry, but tragedy strikes when a fire breaks out at Poonam\'s house two days before the wedding.',
        image: 'http://localhost:5000/uploads/vivah.jpg',
        rating: 6.6,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2006-11-10'
    },
    {
        title: 'Om Shanti Om',
        genre: 'Action, Romance',
        category: 'Bollywood',
        description: 'In the 1970s, Om, an aspiring actor, is murdered, but is immediately reincarnated into the present day. He attempts to discover the mystery of his demise.',
        image: 'http://localhost:5000/uploads/om_shanti_om.jpeg',
        rating: 6.7,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2007-11-09'
    },
    {
        title: 'Tiger 3',
        genre: 'Action, Thriller',
        category: 'Bollywood',
        description: 'Tiger and Zoya are back - to save the country and their family. This time it\'s personal.',
        image: 'http://localhost:5000/uploads/tiger_3.jpg',
        rating: 6.0,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-11-12'
    },
    {
        title: 'Aashiqui 2',
        genre: 'Romance, Drama',
        category: 'Bollywood',
        description: 'Rahul, a singer, loses his fans and fame due to alcoholism. But he then decides to turn a small time singer into a rising star.',
        image: 'http://localhost:5000/uploads/aashiqui_2.jpg',
        rating: 7.0,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2013-04-26'
    },
    {
        title: 'Ek Tha Tiger',
        genre: 'Action, Romance',
        category: 'Bollywood',
        description: 'India\'s top spy Tiger and his love Zoya battle the dark world of intelligence and espionage that forbids its soldiers from loving the enemy.',
        image: 'http://localhost:5000/uploads/ek_tha_tiger.jpg',
        rating: 5.6,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2012-08-15'
    },
    {
        title: 'Geetha Govindam',
        genre: 'Romance, Comedy',
        category: 'Tollywood',
        description: 'An innocent young lecturer is misunderstood as a pervert and despised by a woman who co-incidentally turns out to be the younger sister of his brother-in-law.',
        image: 'http://localhost:5000/uploads/geetha_govidam.jpg',
        rating: 7.7,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2018-08-15'
    },
    {
        title: 'Hanu-Man',
        genre: 'Action, Fantasy',
        category: 'Tollywood',
        description: 'An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.',
        image: 'http://localhost:5000/uploads/hanu_man.jpg',
        rating: 8.0,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2024-01-12'
    },
    {
        title: 'Hi Nanna',
        genre: 'Drama, Romance',
        category: 'Tollywood',
        description: 'A single father begins to narrate the story of his missing wife to his child, with the help of a mysterious woman.',
        image: 'http://localhost:5000/uploads/hi_nanna.jpg',
        rating: 8.3,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-12-07'
    },
    {
        title: 'Rocky Aur Rani Kii Prem Kahaani',
        genre: 'Comedy, Drama',
        category: 'Bollywood',
        description: 'Flamboyant Punjabi Rocky and intellectual Bengali journalist Rani fall in love despite their differences.',
        image: 'http://localhost:5000/uploads/rocky_aur_rani_ki_prem_kahani.jpg',
        rating: 6.8,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-07-28'
    },
    {
        title: 'Shershaah',
        genre: 'Action, Biography',
        category: 'Bollywood',
        description: 'The story of PVC awardee Indian soldier Captain Vikram Batra, whose bravery and unflinching courage in chasing the Pakistani soldiers out of Indian territory contributed immensely to India winning the Kargil War in 1999.',
        image: 'http://localhost:5000/uploads/shershah.jpg',
        rating: 8.4,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2021-08-12'
    },
    {
        title: 'Sita Ramam',
        genre: 'Romance, Drama',
        category: 'Tollywood',
        description: 'A letter from an Indian soldier to his love interest in 1964 causes a ruckus in the lives of a Pakistani girl in 1984.',
        image: 'http://localhost:5000/uploads/sita_ram.jpg',
        rating: 8.6,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2022-08-05'
    },
    {
        title: 'Gadar 2',
        genre: 'Action, Drama',
        category: 'Bollywood',
        description: 'Tara Singh returns to Pakistan to rescue his son Charanjeet Singh from the Pakistani Army during the Indo-Pakistani War of 1971.',
        image: 'http://localhost:5000/uploads/gadar2.jpg',
        rating: 5.2,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-08-11'
    },
    {
        title: 'Devara: Part 1',
        genre: 'Action, Drama',
        category: 'Tollywood',
        description: 'An epic action saga set against coastal lands, which features an emotionally charged incident.',
        image: 'http://localhost:5000/uploads/devara_2.jpg',
        rating: 7.5,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2024-04-05'
    },
    {
        title: 'Drishyam 2',
        genre: 'Crime, Drama',
        category: 'Bollywood',
        description: 'A gripping tale of an investigation and a family which is threatened by it.',
        image: 'http://localhost:5000/uploads/drishyam_2.jpg',
        rating: 8.2,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2022-11-18'
    },
    {
        title: 'Salaar: Part 1 - Ceasefire',
        genre: 'Action, Thriller',
        category: 'Tollywood',
        description: 'A gang leader makes a promise to a dying friend and takes on other criminal gangs.',
        image: 'http://localhost:5000/uploads/salaar.jpg',
        rating: 7.1,
        trailerUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        releaseDate: '2023-12-22'
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Seeding hit movies...');

        for (const movie of hitMovies) {
            // Check if movie exists by title (case/special char loose match)
            const regex = new RegExp(movie.title.replace(/[:\-]/g, '.?'), 'i');

            const existing = await Movie.findOne({ title: { $regex: regex } });

            if (existing) {
                // Update existing
                await Movie.updateOne({ _id: existing._id }, { $set: movie });
                console.log(`[UPDATED] ${movie.title}`);
            } else {
                // Create new
                await Movie.create(movie);
                console.log(`[CREATED] ${movie.title}`);
            }
        }

        console.log('Seeding complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
