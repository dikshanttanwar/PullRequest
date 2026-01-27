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

module.exports = { signupValidation };
