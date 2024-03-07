const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { User } = require("../models/user.model");
const uploadToCloudinary = require("../utils/cloudinaryService");
const ApiResponse = require("../utils/ApiResponse");
const registerUser = asyncHandler(
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async (req, res) => {
    const { fullName, username, email, password } = req.body;
    if (
      [fullName, username, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError({
        statusCode: 400,
        message: "All fields are required",
      });
    }
    const existedUser = User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existedUser) {
      throw new ApiError({
        statusCode: 409,
        message: "Username or email already exists",
      });
    }
    const avatarPath = req.files?.avatar[0]?.path;
    const coverImgPath = req.files?.coverImage[0]?.path;

    if (!avatarPath) {
      throw new ApiError({ statusCode: 400, message: "Avatar image required" });
    }

    const avatarResp = await uploadToCloudinary(avatarPath);
    const coverImgResp = await uploadToCloudinary(coverImgPath);
    if (avatarResp === null) {
      throw new ApiError({
        statusCode: 500,
        message: "Avatar uploading failed",
      });
    }

    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email,
      password: password,
      avatar: avatarResp.url,
      fullName: fullName,
      coverImage: coverImgResp?.url ?? "",
    });
    console.log(newUser);
    return res
      .status(201)
      .json(
        new ApiResponse({
          statusCode: 200,
          message: "User registered successfully",
          data: newUser,
        })
      );
  }
);

module.exports.registerUser = registerUser;
