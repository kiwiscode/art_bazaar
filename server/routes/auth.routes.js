const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the models in order to interact with the database
const User = require("../models/User.model");
const UserVerification = require("../models/UserVerification.model");

// path for static verified page
const path = require("path");

// email handler
const nodemailer = require("nodemailer");

// unique string
const { v4: uuidv4 } = require("uuid");

// _id value to UUID convert
// const ObjectId = require("bson-objectid");

// env variables
require("dotenv").config();

// nodemailer stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});
// testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });

    return;
  }
  //   ! This regular expression checks password for special characters and minimum length

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      return User.create({
        username,
        email,
        password: hashedPassword,
        verified: false,
      });
    })
    .then((user) => {
      sendVerificationEmail(user, res);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
});
//
// send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  // when working on locally
  // const baseURL = "http://localhost:3000";
  // when working on deployment version
  const baseURL = "https://mern-ecommerce-app-j3gu.onrender.com";

  // const uniqueString = uuidv4() + _id;
  const uniqueString = uuidv4() + _id;
  console.log("email:", email);
  console.log("_id:", _id);
  console.log("uniqueString:", uniqueString);
  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",

    html: `
    <p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
      baseURL + "/auth/verified/" + _id + "/" + uniqueString
    }>here</a>to proceed.</p>
    `,
  };

  const newVerification = new UserVerification({
    userId: _id,
    uniqueString: uniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000,
  });
  newVerification
    .save()
    .then(() => {
      transporter
        .sendMail(mailOptions)
        .then(() => {
          res.json({
            status: "PENDING",
            message: "Verification email sent",
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Verification email failed!",
          });
        });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Couldn't save verification email data!",
      });
    });
};

// verify email
router.get("/verified/:userId/:uniqueString", (req, res) => {
  console.log(req.params);
  let { userId, uniqueString } = req.params;
  UserVerification.findOne({ userId })
    .then((result) => {
      // if (result.length > 0)
      if (result) {
        // user verification record exists so we proceed
        const { expiresAt } = result;
        // const hashedUniqueString = result.uniqueString;
        const uniqueStringFromDB = result.uniqueString;

        // checking for expired unique string
        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          UserVerification.findOneAndDelete({ userId })
            .then((result) => {
              console.log(result);
              console.log(userId);
              User.findByIdAndUpdate({ _id: userId })
                .then(() => {
                  let message = "Link has expired.Please sign up again.";
                  res.redirect(`/auth/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message = "Clearing user with expired unique string";
                  res.redirect(`/auth/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occured while clearing expired user verification record";
              res.redirect(`/auth/verified/error=true&message=${message}`);
            });
        } else {
          // hata buradan kaynaklanıyor
          console.log("compare", uniqueString, uniqueStringFromDB);

          // bcrypt
          //   .compare(uniqueString, hashedUniqueString)
          //   .then((result) => {
          //     console.log(result, "rrrrrrrrrrrrr");
          if (uniqueString === uniqueStringFromDB) {
            // strings match
            // User.findByIdAndUpdate(userId, { verified: true })

            User.findByIdAndUpdate(userId, { verified: true })
              .then(() => {
                console.log(userId);
                UserVerification.findOneAndDelete({ userId })
                  .then(() => {
                    console.log(userId);
                    console.log("Email verification successful");
                    res.render("auth/verified");
                  })
                  .catch((error) => {
                    console.log(error);
                    let message =
                      "An error occured while finalizing succesful verification";
                    res.redirect(
                      `/auth/verified/error=true&message=${message}`
                    );
                  });
              })
              .catch((error) => {
                console.log(error);
                let message =
                  "An error occured while updating user record to show verified";
                res.redirect(`/auth/verified/error=true&message=${message}`);
              });
          } else {
            // existing record but incorrect verification details passed
            let message =
              "Invalid verification details passed.Check your inbox.";
            res.redirect(`/auth/verified/error=true&message=${message}`);
          }
        }
        // )
        // .catch((err) => {
        //   console.log(err);
        //   let message = "An error occured while comparing unique strings";
        //   res.redirect(`auth/verified/error=true&message=${message}`);
        // });
      } else {
        // user verification record doesn't exist
        let message =
          "Account record doesn't exist or has been verified already.Please sign up or log in.";
        res.redirect(`/auth/verified/error=true&message=${message}`);
      }
    })
    .catch((err) => {
      console.log(err);
      let message =
        "An error occured while checking for existing user verification record";
      res.redirect(`/auth/verified/error=true&message=${message}`);
    });
});

router.get("/verified", (req, res) => {
  const { error, message } = req.query;
  res.render("auth/verified", { error, message });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ email })
    .then((user) => {
      // check if user verified
      console.log("user : ", user);
      console.log("email hasn't been verified yet : ", !user.verified);
      if (!user.verified) {
        res.status(400).render("auth/login", {
          errorMessage: "Email hasn't been verified yet. Check your inbox.",
        });
        return;
      }

      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          console.log("email verified : ", user.verified);

          const loggedInUsername = username;
          const userOnline = req.session.currentUser;

          req.session.userOnline = userOnline;
          req.session.loggedInUsername = loggedInUsername;
          req.session.currentUser.active = true;

          console.log("USER:", req.session.currentUser);
          console.log("//................//");
          console.log("USER ID:", req.session.currentUser._id);
          console.log("//................//");
          // showing the cookie on the console
          console.log("Active User :", req.session);
          user.active = true;
          user.save();
          // res.redirect("/");
          res.render("index", { loggedInUsername });
        })
        // .then(() => {
        //   res.redirect("/");
        // })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

module.exports = router;
