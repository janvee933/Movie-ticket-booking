import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env variables are loaded (redundant but safe)
dotenv.config();
if (!process.env.PUBLIC_KEY) {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const imagekit = new ImageKit({
    publicKey: process.env.PUBLIC_KEY || '',
    privateKey: process.env.PRIVATE_KEY || '',
    urlEndpoint: process.env.URL_ENDPOINT || ''
});

export default imagekit;
