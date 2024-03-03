const express = require("express");
const cors = require("cors");
const app = express();


app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // if '*' it's unsafe but just for testing and development
    credentials: true,
  })
);
// Json settings
app.use(
  express.json({
    limit: "50kb",
  })
);
// Url encoding
app.use(
  express.urlencoded({
    extended: true,
    limit: "25kb",
  })
);
app.use(express.static("public"));



module.exports.app = app;
