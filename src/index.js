require("dotenv").config();
const { app } = require("./app");
const connectDB = require("./db");
connectDB()
  .then((msg) => {
    console.log(msg);
    app.listen(process.env.PORT, () => {
      console.log(`Server: [running] http://localhost:${process.env.PORT}`);
    });
  })
  .catch((msg) => {
    console.log(msg);
  });
