import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import Showtime from './models/Showtime.js';

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const bookings = await Booking.find().limit(5);
        console.log('--- Recent Bookings ---');
        bookings.forEach(b => {
            console.log(`ID: ${b._id}, Showtime: ${b.showtime}, Seats: ${b.seats}, Status: ${b.status}`);
        });

        const showtimes = await Showtime.find().limit(5);
        console.log('\n--- Recent Showtimes ---');
        showtimes.forEach(s => {
            console.log(`ID: ${s._id}, BookedSeats Count: ${s.bookedSeats?.length || 0}, BookedSeats: ${s.bookedSeats}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
