const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dikshant_dbUser:DNpqBUYkOu7cxSVZ@leaning1.bisl9o6.mongodb.net/devTinder"
  );
};

module.exports = {connectDB};
