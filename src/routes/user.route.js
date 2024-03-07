const { Router } = require("express");
const { registerUser } = require("../controllers/user.controller");
const { multerUpload } = require("../middlewares/multer.middleware");

const userRouter = Router({});

userRouter.route("/register").post(
  multerUpload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser,
);

module.exports = userRouter;
