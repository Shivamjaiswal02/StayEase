const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

//cloudinary configuration -> matlb ki backend ko cloud se jor rahe hain
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

//setting up cloudinary storage for multer

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EasyStay', // The name of the folder in cloudinary where images will be stored
    allowed_formats: ['png','jpg','jpeg','pdf'], // supports promises as well
  },
});

module.exports = { 
    cloudinary: cloudinary.v2,
    storage
};