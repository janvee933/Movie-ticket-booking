import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    seats: [{
        type: String,
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    },
    paymentId: {
        type: String // Stripe/Razorpay ID
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card', 'qr', 'netbanking', 'wallet'],
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
