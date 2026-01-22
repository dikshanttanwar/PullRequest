const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 30,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLenght: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength :6,
      maxLength : 40
    },
    age: {
      type: Number,
      min: 18,
      required: true,
      validate(e) {
        if (e < 18) {
          throw new Error("Must be 18 years old!");
        }
      },
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!value) {
          throw new Error("Please enter your Gender!!");
        }
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender Not Valid!!");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      maxLength: 255,
      default: "Feeling Happy :)",
    },
    skills: {
      type: [String],
      validate(e) {
        if (!Array.isArray(e)) {
          throw new Error("Must be an Array");
        }
        if (e.length >= 10) {
          throw new Error("Maximin of 10 skills only");
        }
      },
    },
    user: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
