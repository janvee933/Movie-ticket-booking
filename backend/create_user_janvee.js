import mongoose from 'mongoose';
import User from './models/User.js';

const DB_URI = 'mongodb://127.0.0.1:27017/movie-booking';

const createUser = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to DB");

        const email = 'janvee84@gmail.com';
        const hashedPassword = '123456'; // Using '123456' as verified in server/index.js line 87 (plain text comparison)

        // Check if user exists just in case
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists. Updating password to '123456'");
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log("User password updated.");
        } else {
            console.log("Creating new user...");
            const newUser = new User({
                name: 'Janvee Sharma',
                email: email,
                password: hashedPassword,
                role: 'user'
            });
            await newUser.save();
            console.log(`User ${email} created with password '123456'.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createUser();
