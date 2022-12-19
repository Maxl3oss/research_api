const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
   cloud_name: 'dopjszhwq',
   api_key: process.env.API_KEY,
   api_secret: process.env.API_SECRET,
   secure: true
});

const optsImage = {
   overwrite: true,
   invalidate: true,
   folder: "project_research/Images",
   resource_type: "auto"
}
const optsPDF = {
   overwrite: true,
   invalidate: true,
   folder: "project_research/PDF",
   resource_type: "auto"
}

exports.uploadImage = (file_base64) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file_base64, optsImage, (err, result) => {
         if (result && result.secure_url) {
            console.log("upload -> " + result.secure_url);
            return resolve(result.secure_url);
         }
         console.log(err.message);
         return reject({ message: err.message })
      })
   })
};

exports.uploadPDF = (file_base64) => {
   return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file_base64, optsPDF, (err, result) => {
         if (result && result.secure_url) {
            console.log("upload -> " + result.secure_url);
            return resolve(result.secure_url);
         }
         console.log(err.message);
         return reject({ message: err.message })
      })
   })
};

exports.delete = (url) => {
   const public_id = url.split("/").slice(-3).join("/").split(".")[0];
   cloudinary.uploader.destroy(public_id, (err, result) => {
      if (err) {
         console.log("delete err -> " + err);
         return
      }
      console.log("delete result -> " + result);
   })
} 