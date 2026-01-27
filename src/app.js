const express = require("express");
const app = express();
const { connectDB } = require("./config/db_connect");
const User = require("./models/users");
const { signupValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/userAuth");
app.use(express.json());
app.use(cookieParser());
app.get("/feed", async (req, res, next) => {
  let data = await User.find({});
  res.send(data);
});

app.post("/createUser", async (req, res, next) => {
  try {
    signupValidation(req);

    let { firstName, lastName, email, password } = req.body;

    let passwordHash = await bcrypt.hash(password, 10);

    let newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await newUser.save();
    res.send("User created successfully!!");
  } catch (err) {
    throw new Error("Error -:)" + err);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    let hash = user.password;

    let isPasswordValid = await bcrypt.compare(password, hash);

    if (isPasswordValid) {
      // Create JWT token
      let token = jwt.sign({ _id: user._id }, "Dikshant@Tinder123");
      // Create cookies and send JWT token
      res.cookie("token", token);
      res.send("Correct Password");
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    throw new Error("Error : " + err.message);
  }
});

app.delete("/deleteUser/:id", async (req, res, next) => {
  let userId = req.params.id;
  try {
    let response = await User.findByIdAndDelete(userId);
    console.log(response);
    if (response) {
      res.status(201).send("User Deleted Successfully!");
    } else {
      throw new Error("Not Working properly!!!!");
    }
  } catch (err) {
    res.status(500).send("Something went wrong!!! " + err.message);
  }
});

app.patch("/updateUser/:id", async (req, res, next) => {
  let userID = req.params.id;
  let data = req.body;

  let ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "about",
  ];

  try {
    let isUpdated = Object.keys(data).every((e) => ALLOWED_UPDATES.includes(e));

    if (!isUpdated) {
      throw new Error("Constraint won't allowed");
    }

    let response = await User.findByIdAndUpdate(userID, data, {
      returnDocument: false,
      runValidators: true,
    });

    res.send(response);
  } catch (err) {
    next(err);
  }
});

// ----------------------------------------------------------------------------------------------------------

app.use(/.*/, (req, res, next) => {
  res.status(404).send("Page Not Found!!!");
});

app.use((err, req, res, next) => {
  let statusCode = err.status || 404;
  res.status(statusCode).json({
    error: true,
    errorMessage: err.message || "User Not Found!!!",
  });
});

connectDB()
  .then(() => {
    console.log("Database Connected!!!");
    app.listen(3000, () => {
      console.log("App listening on server 3000.....");
    });
  })
  .catch((err) => {
    console.log("Error stuck :> ", err);
  })
  .finally(() => {
    console.log("Finally Runs!!!!!");
  });
