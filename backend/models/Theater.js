import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
    name: String, // e.g., "Screen 1"
    type: String, // "Standard", "IMAX"
    capacity: Number,
    rows: { type: Number, default: 8 },
    cols: { type: Number, default: 10 }
}, { _id: false });

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    screens: [screenSchema]
}, { timestamps: true });

export default mongoose.model('Theater', theaterSchema);
