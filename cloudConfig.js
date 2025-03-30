const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,   // ✅ Correct
    api_key: process.env.CLOUD_API_KEY,   // ✅ Fixed key name
    api_secret: process.env.CLOUD_API_SECRET  // ✅ Fixed key name
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "urbanOdyssey",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "gif"], // Allow all image formats
        public_id: (req, file) => file.originalname, // Use original filename
    },
});

module.exports = { cloudinary, storage };
