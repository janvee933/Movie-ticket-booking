import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.role = 'superadmin';
        await user.save();
        console.log(`Successfully promoted ${user.name} (${user.email}) to SuperAdmin!`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Usage: node promote_to_superadmin.js <email>');
    process.exit(1);
}

promoteUser(email);
