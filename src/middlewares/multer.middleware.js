const multer = require("multer");
const diskStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

module.exports.multerUpload = multer({
  storage: diskStore,
});
