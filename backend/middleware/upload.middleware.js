const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Return Cloudinary upload params
        return {
            folder: 'quantum_within',
            format: 'webp', // Standardize on webp
            public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
        };
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isAllowed = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    if (isAllowed) cb(null, true);
    else cb(new Error('Only JPEG/PNG/WebP images allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
