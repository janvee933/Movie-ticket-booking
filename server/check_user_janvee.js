import mongoose from 'mongoose';
import User from './models/User.js';

const DB_URI = 'mongodb://127.0.0.1:27017/movie-booking';

const checkUser = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to DB");

        const email = 'janvee84@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log("User found:");
            console.log("ID:", user._id);
            console.log("Name:", user.name);
            console.log("Email:", user.email);
            console.log("Password:", user.password); // Plaintext
            console.log("Role:", user.role);
        } else {
            console.log(`User ${email} NOT found.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkUser();
