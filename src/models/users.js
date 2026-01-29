const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: isURL } = require("validator/lib/isURL");
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
      validate(e) {
        if (
          !validator.isEmail(e, {
            blacklisted_chars: "#$!",
            host_blacklist: ["cyntexa.com", "temp.com"],
          })
        ) {
          throw new Error("Email is not valid!!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(e) {
        if (!validator.isStrongPassword(e)) {
          throw new Error("Password must be strong!!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      validate(e) {
        if (e < 18) {
          throw new Error("Must be 18 years old!");
        }
      },
    },
    gender: {
      type: String,
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
      validate(e) {
        if (!isURL(e)) {
          throw new Error("Enter valid URL!!");
        }
      },
    },
    about: {
      type: String,
      maxLength: 255,
      default: "Feeling Happy :)",
      validate(e) {
        if (!e) {
          throw new Error("Field cannot be null!!");
        }
      },
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
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  let user = this;

  let token = jwt.sign({ _id: user._id }, "Dikshant@Tinder123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  let user = this;

  let passwordHash = this.password;
  let isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
