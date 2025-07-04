const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'cashier_app',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 800, crop: 'limit' }],
    },
});

module.exports = {
    cloudinary,
    storage,
};
