const mongoose = require("mongoose");
const createSearchIndex = require("../config/postIndex");

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");
    await createSearchIndex();
  } catch (err) {
    console.log(err);
  }
};
