import mongoose from 'mongoose';
import User from './models/User.js';

const DB_URI = 'mongodb://127.0.0.1:27017/movie-booking';

async function verifyAndPromote() {
    try {
        await mongoose.connect(DB_URI);
        const email = 'janvee84@gmail.com';
        const user = await User.findOne({ email });
        
        if (user) {
            console.log('Current User Data:', JSON.stringify({ email: user.email, role: user.role }));
            if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
                console.log('SUCCESS: User role updated to admin');
            } else {
                console.log('INFO: User is already an admin');
            }
        } else {
            console.log('ERROR: User not found');
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

verifyAndPromote();
