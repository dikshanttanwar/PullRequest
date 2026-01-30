const validator = require("validator");

const signupValidation = (req) => {
  let { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
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
  let { firstName, lastName, age, gender, photoURL, about, skills } = req.body;

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

  let isValidEdits = Object.keys(data).every((field) =>
    ALLOWED_UPDATES.includes(field),
  );

  return isValidEdits;
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
