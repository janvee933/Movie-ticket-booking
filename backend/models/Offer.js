import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        trim: true
    },
    validity: {
        type: String, // e.g. "Valid till 25th Dec"
        required: true
    },
    image: {
        type: String, // URL
        required: true
    },
    color: {
        type: String,
        default: '#ef4444'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Offer', offerSchema);
