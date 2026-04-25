import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Offer from './models/Offer.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Clearing existing offers...');
        await Offer.deleteMany({});

        console.log('Seeding new offers...');

        const offers = [
            {
                title: "Early Bird Special",
                description: "Get 25% OFF on all morning shows starting before 11:00 AM. Start your day with cinema!",
                code: "EARLY25",
                validity: "Valid on all days",
                image: "http://localhost:5000/uploads/early_bird_offer.png",
                color: "#f59e0b",
                isActive: true
            },
            {
                title: "Date Night Combo",
                description: "Book 2 tickets and get a FREE Large Popcorn and 2 Soft Drinks combo at the counter.",
                code: "DATENIGHT",
                validity: "Valid on Friday & Saturday",
                image: "http://localhost:5000/uploads/date_night_offer.png",
                color: "#ec4899",
                isActive: true
            },
            {
                title: "IMAX Premiere",
                description: "Experience the magic of IMAX with a flat 15% discount on your first IMAX booking.",
                code: "IMAX15",
                validity: "Valid for first IMAX booking",
                image: "http://localhost:5000/uploads/imax_offer.png",
                color: "#3b82f6",
                isActive: true
            },
            {
                title: "Banking Rewards",
                description: "Get 10% instant cashback up to ₹200 on all tickets booked via SBI Credit Cards.",
                code: "SBI10",
                validity: "Monthly once per user",
                image: "http://localhost:5000/uploads/bank_offer.png",
                color: "#0ea5e9",
                isActive: true
            }
        ];

        await Offer.insertMany(offers);
        console.log('Offers seeded successfully.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
