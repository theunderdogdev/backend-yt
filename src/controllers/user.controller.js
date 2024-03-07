const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { User } = require("../models/user.model");
const uploadToCloudinary = require("../utils/cloudinaryService");
const ApiResponse = require("../utils/ApiResponse");
const { Model, Document } = require("mongoose");

/**
 *
 * @param {Document} user
 * @returns
 */
const generateAccessAndRefereshTokens = async (user) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

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

    const existedUser = await User.findOne({
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
    if (avatarResp instanceof ApiError) {
      throw avatarResp;
    }

    const newUser = await User.create({
      username: username.toLowerCase(),
      email: email,
      password: password,
      avatar: avatarResp.url,
      fullName: fullName,
      coverImage: coverImgResp?.url ?? "",
    });

    return res.status(201).json(
      new ApiResponse({
        statusCode: 200,
        message: "User registered successfully",
        data: newUser,
      })
    );
  }
);

const loginUser = asyncHandler(
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns
   */
  async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      throw new ApiError({ statusCode: 400, message: "Username required" });
    }
    const user = await User.findOne({ username: username });
    if (user && !user.isPasswordCorrect(password)) {
      throw new ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = generateAccessAndRefereshTokens(user);
    return res
      .status(200)
      .cookie("ACCESS_TOKEN", accessToken, { httpOnly: true })
      .json(
        new ApiResponse({
          data: {
            user_id: user._id,
            accessToken: accessToken,
            refreshToken,
          },
          message: "User loggedin successfully!",
        })
      );
  }
);
const logoutUser = asyncHandler(
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async (req, res) => {}
);
module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
