const { connect } = require("mongoose");
const { DB_NAME } = require("../constants");
const connectDB = () => {
  let resolve, reject;
  const prom = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
    .then((connInst) => {
      resolve(`MONGODB: [connected] ${connInst.connection.host}`);
    })
    .catch((err) => {
      reject("MONOGODB: [error]" + err.toString());
      process.exit(1);
    });
  return prom;
};
module.exports = connectDB;
