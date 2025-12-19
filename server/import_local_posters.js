import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from './models/Movie.js';

const ASSETS_DIR = path.join(process.cwd(), 'src', 'assets');
const UPLOADS_DIR = path.join(process.cwd(), 'server', 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

const mappings = [
    { file: 'baahubali', dbTitle: 'Baahubali: The Beginning', ext: '.jpg' },
    { file: 'baahubali 2', dbTitle: 'Baahubali 2: The Conclusion', ext: '.jpg' },
    { file: 'dunki', dbTitle: 'Dunki', ext: '.jpg' },
    { file: 'vivah', dbTitle: 'Vivah', ext: '.jpg' },
    { file: 'om shanti om.jpeg', dbTitle: 'Om Shanti Om', ext: '' } // already has extension
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieBooking')
    .then(async () => {
        console.log('Importing local posters...');

        for (const item of mappings) {
            const srcPath = path.join(ASSETS_DIR, item.file);

            if (fs.existsSync(srcPath)) {
                // Determine destination filename
                const destFilename = item.file.replace(/\s+/g, '_').toLowerCase() + item.ext;
                const destPath = path.join(UPLOADS_DIR, destFilename);

                // Copy file
                fs.copyFileSync(srcPath, destPath);
                console.log(`[COPIED] ${item.file} -> ${destFilename}`);

                // Update DB (URL will be /uploads/filename using the proxy/static serve)
                // We use a relative path /uploads/filename.jpg which the frontend handles via proxy or base URL
                const dbUrl = `http://localhost:5000/uploads/${destFilename}`;

                const res = await Movie.updateOne(
                    { title: { $regex: new RegExp(item.dbTitle, 'i') } },
                    { $set: { image: dbUrl } }
                );

                if (res.matchedCount > 0) {
                    console.log(`[DB UPDATED] ${item.dbTitle}`);
                } else {
                    console.log(`[DB SKIP] Could not find movie: ${item.dbTitle}`);
                }

            } else {
                console.log(`[MISSING] Source file not found: ${srcPath}`);
            }
        }

        console.log('Import complete.');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
