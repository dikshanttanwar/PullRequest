const validator = require("validator");
const { validate } = require("../models/users");

const signupValidation = (req) => {
  let { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    // throw new Error("Name is required");
    if (firstName && !validator.isAlpha(firstName, "en-US", { ignore: " " })) {
      throw new Error("First name must contain only letters");
    }

    if (lastName && !validator.isAlpha(lastName, "en-US", { ignore: " " })) {
      throw new Error("Last name must contain only letters");
    }
  } else if (
    !validator.isEmail(email, {
      blacklisted_chars: "#$!",
      host_blacklist: ["cyntexa.com", "temp.com"],
    })
  ) {
    throw new Error("Email id not Valid!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be strong!!");
  }
};

const validateEditProfileData = (req) => {
  let ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoURL",
    "about",
    "skills",
  ];

  let data = req.body;
  console.log(Object());
  if (data.length == 0) return;

  let isValidEdits = Object.keys(data).every((field) =>
    ALLOWED_UPDATES.includes(field),
  );
  console.log(isValidEdits);
  if (!isValidEdits) {
    return false;
  }
  if (
    data.firstName &&
    !validator.isAlpha(data.firstName, "en-US", { ignore: " " })
  ) {
    throw new Error("First name must contain only letters");
  }

  if (
    data.lastName &&
    !validator.isAlpha(data.lastName, "en-US", { ignore: " " })
  ) {
    throw new Error("Last name must contain only letters");
  }

  if (data.age) {
    if (!validator.isInt(String(data.age), { min: 18, max: 100 })) {
      throw new Error("Enter valid Age!");
    }
  }

  if (data.gender) {
    const allowedGenders = ["male", "female", "other"];
    if (!allowedGenders.includes(data.gender.toLowerCase())) {
      throw new Error(`Invalid gender "${data.gender}"`);
    }
  }

  if (data.photoURL && !validator.isURL(data.photoURL)) {
    throw new Error("Invalid photo URL");
  }

  if (data.about && !validator.isLength(data.about, { min: 0, max: 500 })) {
    throw new Error("About section must be under 500 characters");
  }

  if (data.skills) {
    if (!Array.isArray(data.skills)) {
      throw new Error("Skills must be an array");
    }

    data.skills.forEach((skill) => {
      if (!validator.isLength(skill, { min: 1, max: 50 })) {
        throw new Error("Each skill must be 1–50 characters long");
      }
    });
  }

  return true;
};

const validatePassword = (req) => {
  let ALLOWED_UPDATES = ["password"];

  let isValidField = Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field),
  );

  if (!isValidField) {
    throw new Error("Invalid input fields!!");
  }

  if (!validator.isStrongPassword(req.body.password)) {
    throw new Error("Password is weak!!");
  }

  return isValidField;
};

module.exports = {
  signupValidation,
  validateEditProfileData,
  validatePassword,
};
