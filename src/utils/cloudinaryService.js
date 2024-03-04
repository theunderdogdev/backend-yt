const { v2: cloudinary } = require("cloudinary");
const { unlinkSync, existsSync } = require("fs");
const {} = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!existsSync(filePath)) {
      // Convert to error
      return null;
    }
    return await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
  } catch (error) {
    unlinkSync(filePath);
    // Convert to error
    return null;
  }
};
module.exports = uploadToCloudinary;