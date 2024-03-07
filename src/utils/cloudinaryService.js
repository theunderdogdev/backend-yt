const { v2: cloudinary } = require("cloudinary");
const { unlinkSync, existsSync } = require("fs");
const {} = require("path");
const ApiError = require("./ApiError");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!existsSync(filePath)) {
      return new ApiError({ statusCode: 400, message: "Couldn't find file!" });
    }
    const resp = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    unlinkSync(filePath);
    return resp;
  } catch (error) {
    unlinkSync(filePath);
    return new ApiError({ statusCode: 500, message: error.message });
  }
};
module.exports = uploadToCloudinary;
