import mongoose from 'mongoose';
import User from './models/User.js';

const DB_URI = 'mongodb://127.0.0.1:27017/movie-booking';

async function checkUser() {
    try {
        await mongoose.connect(DB_URI);
        const email = 'janvee84@gmail.com';
        const user = await User.findOne({ email });
        
        if (user) {
            console.log('USER_FOUND');
            console.log('EMAIL:', user.email);
            console.log('PASSWORD_IN_DB:', user.password);
            console.log('ROLE:', user.role);
            
            // Set password clearly to 123456 just in case
            user.password = '123456';
            await user.save();
            console.log('PASSWORD_RESET_SUCCESS: Password has been set to 123456');
        } else {
            console.log('USER_NOT_FOUND');
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkUser();
