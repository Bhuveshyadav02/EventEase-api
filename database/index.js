const mongoose = require("mongoose");

  
const connectDB = async () => {
  const url =process.env.MONGODB
   console.log(url)
  return mongoose.connect(url, {});
};

module.exports = connectDB;
