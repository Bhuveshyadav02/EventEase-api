const mongoose = require("mongoose");
const url =
  "mongodb+srv://bhuvesh:1234@nodeexpressprojects.mdmrvlx.mongodb.net/HallBooking?retryWrites=true&w=majority&appName=NodeExpressProjects";
const connectDB = async () => {
  // console.log(url)
  return mongoose.connect(url, {});
};

module.exports = connectDB;
