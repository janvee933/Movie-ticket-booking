import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true // e.g., 'Hollywood', 'Bollywood'
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    trailerUrl: {
        type: String
    },
    duration: {
        type: Number, // in minutes
        default: 120
    },
    releaseDate: {
        type: Date
    },
    cast: [{
        name: String,
        role: String,
        image: String
    }],
    reviews: [{
        user: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);
