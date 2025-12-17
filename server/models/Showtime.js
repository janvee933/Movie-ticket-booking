import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    screen: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seats: {
        type: Map,
        of: String,
        // Example: { "A1": "available", "A2": "booked" }
        // Or simpler: Array of booked seat numbers
        default: {}
    },
    bookedSeats: [{
        type: String // Array of seat IDs like "A1", "B2"
    }]
}, { timestamps: true });

export default mongoose.model('Showtime', showtimeSchema);
