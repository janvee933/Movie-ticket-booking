import mongoose from 'mongoose';
import Movie from './models/Movie.js';

// Connection String
const DB_URI = 'mongodb://127.0.0.1:27017/movie-booking';

// Data from src/data/movies.js (Manually copied or imported if possible, manually copying here for simplicity in a standalone script)
const moviesData = [
    // Hollywood
    {
        title: "Inception",
        genre: "Sci-Fi",
        category: "Hollywood",
        rating: 4.8,
        image: "https://image.tmdb.org/t/p/original/8IB2zC3zYDK9NoHgQD6PJy5Wn0.jpg",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        category: "Hollywood",
        rating: 4.9,
        image: "https://image.tmdb.org/t/p/original/gEU2QniE6E77H6RiAKWHJPed0cQ.jpg",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
    },
    {
        title: "The Dark Knight",
        genre: "Action",
        category: "Hollywood",
        rating: 5.0,
        image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY"
    },
    {
        title: "Dune: Part Two",
        genre: "Sci-Fi",
        category: "Hollywood",
        rating: 4.7,
        image: "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w"
    },
    {
        title: "Avengers: Endgame",
        genre: "Action",
        category: "Hollywood",
        rating: 4.8,
        image: "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c"
    },
    {
        title: "Oppenheimer",
        genre: "Drama",
        category: "Hollywood",
        rating: 4.6,
        image: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg"
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        genre: "Animation",
        category: "Hollywood",
        rating: 4.9,
        image: "https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        trailerUrl: "https://www.youtube.com/embed/cqGjhVJWtEg"
    },
    {
        title: "The Batman",
        genre: "Action",
        category: "Hollywood",
        rating: 4.5,
        image: "https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        trailerUrl: "https://www.youtube.com/embed/mqqft2x_Aa4"
    },
    {
        title: "Avatar: The Way of Water",
        genre: "Sci-Fi",
        category: "Hollywood",
        rating: 4.8,
        image: "https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        trailerUrl: "https://www.youtube.com/embed/a8Gx8wiNbsQ"
    },
    {
        title: "Top Gun: Maverick",
        genre: "Action",
        category: "Hollywood",
        rating: 4.9,
        image: "https://image.tmdb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17dbH.jpg",
        description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
        trailerUrl: "https://www.youtube.com/embed/qSqVVswa420"
    },

    // Bollywood
    {
        title: "Jawan",
        genre: "Action",
        category: "Bollywood",
        rating: 4.5,
        image: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg",
        description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
        trailerUrl: "https://www.youtube.com/embed/COv52Qyctws"
    },
    {
        title: "3 Idiots",
        genre: "Comedy",
        category: "Bollywood",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
        description: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
        trailerUrl: "https://www.youtube.com/embed/K0eDlFX9GMc"
    },
    {
        title: "Dangal",
        genre: "Drama",
        category: "Bollywood",
        rating: 4.8,
        image: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
        description: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
        trailerUrl: "https://www.youtube.com/embed/x_7YlGv9u1g"
    },
    {
        title: "Animal",
        genre: "Action",
        category: "Bollywood",
        rating: 4.7,
        image: "https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg",
        description: "A son undergoes a remarkable transformation as the bond with his father begins to fracture, and he becomes consumed by a quest for vengeance.",
        trailerUrl: "https://www.youtube.com/embed/Dydmpfo68DA"
    },
    {
        title: "Tiger 3",
        genre: "Action",
        category: "Bollywood",
        rating: 4.4,
        image: "https://upload.wikimedia.org/wikipedia/en/7/70/Tiger_3_poster.jpg",
        description: "Tiger and Zoya are back - to save the country and their family. This time it's personal.",
        trailerUrl: "https://www.youtube.com/embed/vMphqjE1hew"
    },
    {
        title: "Dunki",
        genre: "Comedy",
        category: "Bollywood",
        rating: 4.6,
        image: "https://upload.wikimedia.org/wikipedia/en/a/a4/Dunki_poster.jpg",
        description: "Four friends from a village in Punjab share a common dream: to go to England. Their problem is that they have neither the visa nor the ticket.",
        trailerUrl: "https://www.youtube.com/embed/AMJb4h1Yn8"
    },
    {
        title: "Ek Tha Tiger",
        genre: "Action",
        category: "Bollywood",
        rating: 4.6,
        image: "https://upload.wikimedia.org/wikipedia/en/2/2b/Ek_Tha_Tiger_poster.jpg",
        description: "India's top spy Tiger and his love Zoya battle the dark world of intelligence and espionage that forbids its soldiers from loving the enemy.",
        trailerUrl: "https://www.youtube.com/embed/ePoK29CzkoE"
    },
    {
        title: "Om Shanti Om",
        genre: "Drama",
        category: "Bollywood",
        rating: 4.7,
        image: "https://upload.wikimedia.org/wikipedia/en/0/0e/Om_Shanti_Om_poster.jpg",
        description: "In the 1970s, Om, an aspiring actor, is murdered, but is immediately reincarnated into the present day. He attempts to discover the mystery of his demise and find Shanti, the love of his previous life.",
        trailerUrl: "https://www.youtube.com/embed/hXM0X31Xbsw"
    },
    {
        title: "Vivah",
        genre: "Drama",
        category: "Bollywood",
        rating: 4.5,
        image: "https://upload.wikimedia.org/wikipedia/en/1/1a/Vivah_poster.jpg",
        description: "Poonam, a traditionally brought-up young woman, is to marry Prem, a groom chosen by her uncle. However, a tragedy strikes just days before the wedding.",
        trailerUrl: "https://www.youtube.com/embed/8qM7g_n7M7Q"
    },
    {
        title: "Pathaan",
        genre: "Action",
        category: "Bollywood",
        rating: 4.7,
        image: "https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg",
        description: "An Indian agent races against a doomsday clock as a ruthless mercenary, with a bitter vendetta, mounts an apocalyptic attack against the country.",
        trailerUrl: "https://www.youtube.com/embed/vqu4z34wENw"
    },
    {
        title: "Gadar 2",
        genre: "Action",
        category: "Bollywood",
        rating: 4.5,
        image: "https://upload.wikimedia.org/wikipedia/en/6/62/Gadar_2_film_poster.jpg",
        description: "Tara Singh returns to Pakistan to rescue his son Charanjeet Singh who is imprisoned by the Pakistan Army.",
        trailerUrl: "https://www.youtube.com/embed/xAIBtL1nE-Q"
    },
    // Tollywood
    {
        title: "RRR",
        genre: "Action",
        category: "Tollywood",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
        description: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.",
        trailerUrl: "https://www.youtube.com/embed/NgBoMJy386M"
    },
    {
        title: "Baahubali 2: The Conclusion",
        genre: "Action",
        category: "Tollywood",
        rating: 5.0,
        image: "https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion.jpg",
        description: "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.",
        trailerUrl: "https://www.youtube.com/embed/G62HrubdM5o"
    },
    {
        title: "Pushpa: The Rise",
        genre: "Action",
        category: "Tollywood",
        rating: 4.6,
        image: "https://upload.wikimedia.org/wikipedia/en/7/75/Pushpa_-_The_Rise_%282021_film%29.jpg",
        description: "A labourer rises through the ranks of a red sandal smuggling syndicate, making some powerful enemies in the process.",
        trailerUrl: "https://www.youtube.com/embed/QKxaj1o9UZk"
    },
    {
        title: "Baahubali: The Beginning",
        genre: "Action",
        category: "Tollywood",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/5/51/Baahubali_The_Beginning_poster.jpg",
        description: "In the kingdom of Mahishmati, a fair-hearted warrior who is raised by a tribal couple, discovers his royal heritage and his destiny.",
        trailerUrl: "https://www.youtube.com/embed/sOEg_YZQsTI"
    },
    {
        title: "K.G.F: Chapter 2",
        genre: "Action",
        category: "Tollywood",
        rating: 4.9,
        image: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg",
        description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.",
        trailerUrl: "https://www.youtube.com/embed/JKa05nyUmuQ"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to DB for seeding");

        // Clear existing movies
        await Movie.deleteMany({});
        console.log("Cleared existing movies");

        // Insert new movies
        await Movie.insertMany(moviesData);
        console.log("Movies seeded successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
