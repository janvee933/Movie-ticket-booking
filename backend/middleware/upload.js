import multer from 'multer';
import imagekit from '../utils/imagekit.js';

// Use memory storage to avoid saving files locally
const storage = multer.memoryStorage();
const multerUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * Middleware to upload to ImageKit
 * @param {string} fieldName - The name of the file field in req.body
 * @param {string} folder - ImageKit folder name
 */
export const uploadImage = (fieldName, folder = '/movie-uploads') => {
    return [
        multerUpload.single(fieldName),
        async (req, res, next) => {
            if (!req.file) {
                return next();
            }

            try {
                const result = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: `${Date.now()}-${req.file.originalname}`,
                    folder: folder
                });

                // Attach the ImageKit URL to req.body so the controller can use it
                req.body[fieldName] = result.url;
                next();
            } catch (error) {
                console.error('ImageKit upload error details:', error);
                res.status(500).json({ 
                    message: 'Error uploading image to ImageKit', 
                    error: error.message 
                });
            }
        }
    ];
};
