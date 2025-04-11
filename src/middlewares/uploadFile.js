import multer from "multer";

// Configure multer middleware to handle form data parsing
const uploadMiddleware = multer();

// Define a common middleware to handle form data parsing for both endpoints
export const commonUploadMiddleware = (req, res, next) => {
    // Use upload middleware to parse form data
    uploadMiddleware.any()(req, res, (err) => {
        if (err) {
            // Handle error if any
            console.error('Error parsing form data:', err);
            return res.status(400).json({ error: 'Failed to parse form data' });
        }
        next(); // Proceed to the next middleware
    });
};
