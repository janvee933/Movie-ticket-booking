import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create Order
router.post('/order', verifyToken, async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
});

// Verify Payment
router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature 
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.json({ message: "Payment verified successfully", success: true });
        } else {
            return res.status(400).json({ message: "Invalid signature", success: false });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

export default router;
