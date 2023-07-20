const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the models in order to interact with the database
const User = require("../models/User.model");

// path for static verified page
const path = require("path");

// email handler
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");

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

// GET /auth/signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", (req, res, next) => {
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
      return User.create({
        username,
        email,
        password: hashedPassword,
        verified: false,
      });
    })
    .then((user) => {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h", // Token süresi
      });
      console.log("Token", token);
      sendVerificationEmail(user, res, token);
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

const sendVerificationEmail = ({ _id, email }, res, token) => {
  const baseURL = "http://localhost:3000";
  // when working on deployment version
  // const baseURL = "https://mern-ecommerce-app-j3gu.onrender.com";

  // mail options with token
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",

    html: `
    <p>Verify your email adress to complete the signup and login into your account.</p>
    <p>This link expires in <b>6 hours.</b></p>
    <p>Press : <a href="${baseURL}/auth/verify?token=${token}"> here </a>to proceed.</p>


    `,
  };

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
    })
    .catch((error) => {
      console.log(error);
      res.json({
        status: "FAILED",
        message: "Couldn't save verification email data!",
      });
    });
};

router.get("/verified", (req, res) => {
  const { error, message } = req.query;
  res.render("auth/verified", { error, message });
});

// GET /auth/login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", (req, res, next) => {
  const { username, email, password } = req.body;

  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }

  User.findOne({ email })
    .then((user) => {
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
          user.active = true;
          user.save();

          const userId = user._id;
          const username = user.username;
          const email = user.email;
          const carts = user.carts;
          const active = user.active;

          const userInfo = {
            username,
            email,
            carts,
            userId,
            active,
          };
          // with token
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h", // Token süresi
          });
          console.log(userInfo);
          console.log("email verified : ", user.verified);

          res.json({ token, user: userInfo });
        })
        // .then(() => {
        //   res.redirect("/");
        // })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// with token
router.get("/verify", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.redirect("/auth/verified?error=true&message=Invalid token");
    } else {
      const userId = decoded.userId;
      User.findByIdAndUpdate(userId, { verified: true })
        .then(() => {
          res.render("auth/verified");
        })
        .catch((error) => {});
    }
  });
});

module.exports = router;
