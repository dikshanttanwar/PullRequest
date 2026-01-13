const express = require("express");
const app = express();
const { connectDB } = require("./config/db_connect");
// const { adminAuth, userAuth, rateLimiter } = require("./middlewares/auth");
const User = require("./models/users");
app.use(express.json());

app.patch("/updateUserData", async (req, res, next) => {
  let emailId = req.body.email;
  let data = req.body;
  console.log(emailId);
  let response = await User.findOneAndUpdate({ email: emailId }, data);
  // let response = User.findOne({ email: emailId });

  res.send(response);
});

app.patch("/updateData", async (req, res, next) => {
  let userId = req.body.userId;
  console.log(userId);
  let data = req.body;
  let response = await User.findByIdAndUpdate(userId, data, {
    // returnDocument: "after",
    lean: true,
  });
  res.send(response);
});

app.get("/findSingle", async (req, res, next) => {
  try {
    let response = await User.findOne(null);
    // let response = await User.findById(null);
    if (!response) {
      let err = new Error(response);
      return next(err);
    }
    res.send(response);
  } catch (err) {
    next(err);
  }
});

app.post("/deleteUser", async (req, res, next) => {
  let userName = req.body.email;
  let result = await User.deleteMany({ email: userName });
  res.send(result);
});

app.patch("/updateUser/:userId", async (req, res, next) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let { firstName, lastName } = req.body;
    let response = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName }
    );

    if (!response) {
      res.status(500).send("Something Went Wrong!!");
    }

    res.send("User Updated Successfully!!");
  } catch (err) {
    res.send(err);
  }
});

app.post("/createUser", async (req, res, next) => {
  let response = new User(req.body);
  await response.save();
  res.send(response);
});

app.get("/getById", async (req, res, next) => {
  // let result = await User.findById("696224f120ba83092c8e7019");
  // let result = await User.exists({firstName : "Dikshant"});
  // let result = await User.find({firstName : "Dikshant"});
  res.send(result);
});

app.get("/getAllNames", async (req, res, next) => {
  let users = await User.find({}).select("firstName lastName");
  let cleanData = users.map((singleUser) => {
    return {
      firstname: singleUser.firstName,
      lastName: singleUser.lastName,
    };
  });
  res.send(cleanData);
});

app.use("/signup", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const err = new Error("User Already Exist");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.get("/getAll", async (req, res, next) => {
  let totalUsers = await User.countDocuments({});
  res.send(totalUsers);
});

app.get("/feed", async (req, res, next) => {
  // const user = await User.find({ age: 22 });
  const user = await User.countDocuments();
  res.send(user);
});

app.post("/signup", async (req, res, next) => {
  // const user = new User(userObj);
  const user = new User(req.body);

  await user.save();
  res.status(200).send(req.body);
});

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

// app.get("/getUser", (req, res, next) => {
//   if (req.query.userId === "321") {
//     res.send(`Welcome User. Your User ID is :> ${req.query.userId}`);
//   } else {
//     const err = new Error("Unauthorised Access!!");
//     err.status = 403;
//     next(err);
//   }
// });

// app.use((err, req, res, next) => {
//   let statusCode = err.status || 500;
//   res.status(statusCode).json({
//     error: true,
//     errorMessage: err.message || "Something went wrong",
//   });
// });

// app.use("/", (req, res, next) => {
//   console.log("Fix Route for All");
//   // res.send("Global Route");
//     res.json({
//       globalJSON: true,
//     });
//   next();
// });

// app.get("/getUser", (req, res, next) => {
//   try {
//     if (req.query.userId === "123") {
//       res.send("Welcome User!!!");
//     } else {
//       throw new Error("Unkonwn user access!!!");
//     }
//   } catch (err) {
//     next(err);
//   }
//   // if (req.query.userId === "123") {
//   //   res.send("Welcome!!!");
//   // } else {
//   //   let err = new Error("Invalid User");
//   //   err.status = 401;
//   //   next(err);
//   // }
// });

// app.use(/.*/, (err, req, res, next) => {
//   let statusCode = err.status || 500;
//   res.status(statusCode).json({
//     error: true,
//     errorMessage: err.message,
//   });
// });

// app.use('/rateLimiter',rateLimiter,(req,res,next)=>{
//   res.send("Access Granted");
// })

// app.use((err,req,res,next)=>{
//   let statusCode = err.statusCode || 505;
//   res.status(statusCode).json({
//     error : true,
//     errorMessage : err.message || "Internal Server Problem"
//   })
// })

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res, next) => {
//   res.send("Received all the data!!!");
//   // next();
// });

// app.get("/user", userAuth, (req, res, next) => {
//   res.send("Welcome User");
// });

// app.use(/.*/, (req, res) => {
//   res.status(404).json({
//     error: true,
//     errorMessage: "Requested URL not found!!",
//   });
// });

// app.use((err, req, res, next) => {
//   const statusCode = err.status || 500;

//   res.status(statusCode).send({
//     error: true,
//     errorMessage: err.message || "Internal Server Error",
//   });

//   console.error(err.stack);
// });

// app.use("/users", (req, res, next) => {
//   console.log("/users - authentication!!");
//   next();
// });

// app.all("/users", (req, res, next) => {
//   res.status(404).send("Final Endpoint!!");
// });

// app.all("/users/admin", (req, res, next) => {
//   res.send("/users/admin -> Route Ending!");
// });

// app.use("/user", (req, res, next) => {
//   console.log("App.user -> Middleware check");
//   // res.send("User FOUND!!!!!")
//   next();
// });

// app.get(
//   "/user",
//   (req, res, next) => {
//     console.log("First MiddleWare Check!! -> User Found");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Second MiddleWare Check!! -> User Logged ID");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Final Call!!");
//     res.send("Congratulations!!!!!");
//   }
// );

// app.use("/user",(req,res,next)=>{
//   console.log("User Final Checkpoint!!");
//   res.send("Welcome!!!");
//   next();
// });

// app.use("/user",(req,res,next)=>{
//   console.log("Next Checkpoint!!");
//   // res.send("Final!!!")
//   // next();
// });

// app.use(
//   "/route",
//   (req, res, next) => {
//     console.log("First Request Entertained");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Second Request Entertained");
//     next();
//   },
//   [
//     (req, res, next) => {
//       console.log("Third Request Entertained");
//       next();
//     },
//     (req, res, next) => {
//       console.log("Fourth Request Entertained");
//       res.send("Final Boss Response!!!");
//       next();
//     },
//   ]
// );

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("First Request Called!!!");
//     next();
//     res.send("First Request Entertained!!!")
//   },
//   (req, res, next) => {
//     console.log("Second Request Called!!!");
//     res.send("Second Request Entertained!!!");
//     console.log("Second Request Second Part Called!!!");
//   }
// );

// app.use(
//   "/user",
//   (req, res, next) => {
//     // First Request Handler
//     console.log("First Request Entertained!!");
//     req.firstResponse = "Pehla Nasha Response!!";
//     next();
//   },
//   (req, res) => {
//     // Second Request Handler
//     console.log("Second Request Entertained!!");
//     res.send(`${req.firstResponse} --- Second Response!!`);
//   }
// );

// app.use("/user", (req, res, next) => {
//   // res.send("hell")
//   console.log("Server Called!!!");
//   // next();
// });

// app.get("/user/:id", (req, res) => {
//   res.send(req.params.id);
// });

// app.get("/user", (req, res) => {
//   res.send(req.query);
// });

// app.get(/.*fly$/, (req, res) => {
//   console.log("Route matched successfully!");
//   res.send("Successful!!!");
// });

// app.get(/a*b/, (req, res) => {
//   console.log("Route matched successfully!");
//   res.send("Successful!!!");
// });

// app.get(/ab?c/, (req, res) => {
//   console.log("Route matched successfully!");
//   res.send("Successful!!!");
// });

// app.get(/ab+c/, (req, res) => {
//   console.log("Route matched successfully!");
//   res.send("Successful!!!");
// });

// app.use(express.json());

// app.post("/createProfile", (req, res, next) => {
//   let data = req.body;
//   // res.send(req.body);
//   res.send(`Hey, Your data is here - ${JSON.stringify(data)}`);
// });

// app.use(express.json());

// app.use("/user", (req, res) => {
//   res.send("APP.USE BLOCK RUNS!!!");
// });

// app.get("/user", (req, res) => {
//   res.send("Data Fetched Successfully!!!");
// });

// app.post("/user", (req, res) => {
//   res.send("Data POSTED Successfully!!!");
// });

// app.delete("/user", (req, res) => {
//   res.send("Data DELETED Successfully!!!");
// });

// app.patch("/user", (req, res) => {
//   res.send("Data PATCHED Successfully!!!");
// });

// app.use("/", (req, res, next) => {
//   req.userType = "Admin";
//   next();
// });

// app.use("/", (req, res, next) => {
//   req.isVIP = true;
//   next();
// });

// app.get("/user", (req, res, next) => {
//   res.send(`Hello, ${req.isVIP ? req.userType : "User"}.`);
// });

// app.get("/getUser", (req, res, next) => {
//   res.send({ FirstName: "Dikshant", LastName: "Tanwar" });
// });

// app.post("/profile", (req, res, next) => {
//   console.log(req.body); // Express is smart, it internally calls res.json() and convert it into string easily.

//   res.send(`Your Submitted Data is : - ${JSON.stringify(req.body)}`);

//   // res.send(`${req.body}`); // the O/p will be for this was [object object], because you are directly forcing the object to be string before it even reaches the express, that's why express can't fix the [object object] problem here.
//   // to fix that thing use the res.json() or JSON.stringify(req.body);
// });

// app.use("/", (req, res, next) => {
//   res.send("MiddleWare 1");
//   next();
// });

// app.use("/", (req, res, next) => {
//   res.send("MiddleWare 2");
//   next();
// });

// app.get("/user", (req, res) => {
//   res.send("Hii user How are you!!!!");
// });

// app.get("/profile", (req, res) => {
//   res.send("Hii Profile!! How are you!!!!");
// });

// app.use("/", (req, res, next) => {
//   res.send("Hello from the / URL");
//   next();
// });

// app.get("/profile", (req, res) => {
//   res.send("Hello from the Profiles!!!");
// });

// app.use("/profile", (req, res) => {
//   res.send("Developer's Profiles Here");
// });

// app.use("/profileDevs", (req, res) => {
//   res.send("Get all the Profiles Here");
// });

// app.use("/test", (req, res) => {
//   res.send("Testing endpoint");
// });

// app.use("/", (req, res) => {
//   res.send("Welcome to the Developer's Tinder");
// });
