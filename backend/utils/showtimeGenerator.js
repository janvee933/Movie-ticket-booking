import Theater from '../models/Theater.js';
import Showtime from '../models/Showtime.js';

/**
 * Automatically generates default showtimes for a new movie.
 * Creates morning and evening shows for the next 2 days in existing theaters.
 */
export const generateDefaultShowtimes = async (movieId) => {
    try {
        console.log(`Generating default showtimes for movie: ${movieId}`);
        
        // 1. Get available theaters
        const theaters = await Theater.find().limit(3); // Assign to up to 3 theaters
        
        if (theaters.length === 0) {
            console.warn('No theaters found. Cannot generate showtimes.');
            return;
        }

        const showtimes = [];
        const now = new Date();
        const dates = [
            new Date(now), // Today
            new Date(new Date().setDate(now.getDate() + 1)), // Tomorrow
            new Date(new Date().setDate(now.getDate() + 2))  // Day After
        ];

        for (const theater of theaters) {
            // Use the first screen or alternate
            const screen = theater.screens[0];
            if (!screen) continue;

            for (const date of dates) {
                // Morning Show (10:00 AM)
                const morning = new Date(date);
                morning.setHours(10, 0, 0, 0);

                // Afternoon Show (2:00 PM)
                const afternoon = new Date(date);
                afternoon.setHours(14, 0, 0, 0);

                // Evening Show (6:00 PM)
                const evening = new Date(date);
                evening.setHours(18, 0, 0, 0);

                // Night Show (10:00 PM)
                const night = new Date(date);
                night.setHours(22, 0, 0, 0);

                const times = [
                    { time: morning, price: 200 },
                    { time: afternoon, price: 250 },
                    { time: evening, price: 300 },
                    { time: night, price: 350 }
                ];

                for (const item of times) {
                    showtimes.push({
                        movie: movieId,
                        theater: theater._id,
                        screen: screen.name,
                        startTime: item.time,
                        price: item.price,
                        seats: {}, // Initialize as empty map for the model
                        bookedSeats: []
                    });
                }
            }
        }

        if (showtimes.length > 0) {
            await Showtime.insertMany(showtimes);
            console.log(`Successfully generated ${showtimes.length} showtimes for movie ${movieId}`);
        }
    } catch (error) {
        console.error('Error in generateDefaultShowtimes:', error);
    }
};
