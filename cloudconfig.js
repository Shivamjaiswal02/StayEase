const cloudinary = require('cloudinary').v2;
const  CloudinaryStorage  = require('multer-storage-cloudinary').CloudinaryStorage;


//cloudinary configuration -> matlb ki backend ko cloud se jor rahe hain
cloudinary.config({
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
    cloudinary,
  storage
};