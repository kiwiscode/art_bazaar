require("dotenv").config();

const passport = require("passport");

const express = require("express");
const router = express.Router();

const capitalize = require("../utils/capitalize");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto");

function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtMiddleware");

const mongoose = require("mongoose");

const Collector = require("../models/Collector.model");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log(success);
  }
});

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    const collector = await Collector.find({ email: email });
    console.log("collector:", collector);
    if (collector?.length) {
      return res.status(409).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signup", (req, res, next) => {
  let { name, email, password } = req.body.signUpFormData;

  if (name) {
    name = capitalize(name);
  }

  if (name === "" || email === "" || password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory. Please provide your email and password.",
    });

    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password) || password.length < 8) {
    res.status(402).json({
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return Collector.create({
        name,
        email,
        password: hashedPassword,
        verified: false,
      });
    })
    .then((collector) => {
      const expiresInDays = 30;

      const token = jwt.sign(
        { collectorId: collector._id },
        process.env.JWT_SECRET,
        {
          expiresIn: `${expiresInDays}d`,
        }
      );
      sendVerificationEmail(collector, res, token);
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(501).json({
          errorMessage: "Email need to be unique. Provide a valid email.",
        });
      } else {
        next(error);
      }
    });
});

const sendVerificationEmail = ({ _id, email }, res, token) => {
  const baseURL = "http://localhost:3000";

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Art Bazaar Account",

    html: `
    <div style="background-color: #f6f8fa; style="font-size: 16px; line-height: 22px;" text-align: left; font-family: Times New Roman", Times, serif">
    <div style="width: 40%; height: 100%; background-color: white; margin: 0 auto; text-align: left; color: #333; padding: 20px;">
      <div style="font-size: 22px; line-height: 33px; ">Please confirm your email address
      </div>
      <p style="font-size: 16px; line-height: 22px;">
      To secure your account and receive updates about your transactions on Art Bazaar, please confirm your email address.
      </p>
      <div style="background-color: black; border-radius: 3px; min-height: 50px; width: 100%; cursor: pointer;">
        <a href="${baseURL}/auth/verify?token=${token}" style="text-decoration: none; color: white; background-color: black; display: block; text-align: center; font-size: 16px; line-height: 22px; padding: 15px 0;">
          Confirm email
        </a>
      </div>
      <p style="font-size: 16px; line-height: 22px;">Thanks,</p>
      <p style="font-size: 16px; line-height: 22px;">Art Bazaar</p>
    </div>
  </div>
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
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "Verification email failed!",
      });
    })
    .catch(() => {
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

router.post("/login", (req, res, next) => {
  const { email, password } = req.body.loginFormData;

  if (email === "" || password === "") {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory. Please provide email and password.",
    });

    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password) || password.length < 8) {
    res.status(402).json({
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  Collector.findOne({ email })
    .populate("favoriteArtworks")
    .populate("followedArtists")
    .populate("collection")
    .populate({
      path: "collection",
      populate: {
        path: "artist",
        model: "Artist",
      },
    })
    .populate({
      path: "collection",
      populate: {
        path: "collector",
        model: "Collector",
      },
    })
    .then((collector) => {
      if (!collector) {
        res.status(401).json({ errorMessage: "Wrong credentials." });
        return;
      }

      bcrypt
        .compare(password, collector.password)
        .then((isSamePassword) => {
          if (!isSamePassword || collector.email !== email) {
            res.status(401).json({ errorMessage: "Wrong credentials." });
            return;
          }
          collector.active = true;
          collector.save().then((updatedCollector) => {
            const {
              _id,
              name,
              email,
              verified,
              active,
              order,
              isAdmin,
              contact,
              isWelcomeModalShowed,
              profileImage,
              favoriteArtworks,
              artWorks,
              followedArtists,
              artistProfile,
              isArtist,
              isSeller,
              collection,
              about,
              location,
              otherRelevantPosition,
              profession,
            } = updatedCollector;
            const token = jwt.sign(
              { collectorId: _id },
              process.env.JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );

            res.json({
              token,
              collector: {
                _id,
                name,
                email,
                verified,
                active,
                order,
                isAdmin,
                contact,
                isWelcomeModalShowed,
                profileImage,
                favoriteArtworks,
                artWorks,
                followedArtists,
                artistProfile,
                isArtist,
                isSeller,
                collection,
                about,
                location,
                otherRelevantPosition,
                profession,
              },
            });
          });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, collector, info) => {
    if (err) return next(err);
    if (!collector)
      return res.redirect(`${process.env.FRONTEND_URL}/login/failed`);

    console.log("collector:", collector.name);
    req.logIn(collector, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        { collectorId: collector._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.redirect(
        `${process.env.FRONTEND_URL}/?token=${token}&collector=${JSON.stringify(
          collector
        )}`
      );
    });
  })(req, res, next);
});

router.post("/logout", authenticateToken, async (req, res, next) => {
  try {
    const { collectorId } = req.collector;
    console.log("collectorId:", collectorId);

    const updatedCollector = await Collector.findByIdAndUpdate(
      collectorId,
      { active: false },
      { new: true }
    );

    if (updatedCollector) {
      res.status(200).json({ message: "Logout successful" });
    } else {
      res.status(500).json({ message: "Error updating collector" });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "Error updating collector" });
  }
});

const sendForgotPasswordEmail = (email, res, token) => {
  const baseURL = "http://localhost:5173";

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Reset password instructions",

    html: `
    <div style="background-color: #f6f8fa; text-align: left; font-size: 16px; line-height: 22px; font-family: Times New Roman", Times, serif">
    <div style="width: 40%; height: 100%; background-color: white; margin: 0 auto; text-align: left; color: #333; padding: 20px;">
      <div style="font-size: 16px; line-height: 22px; ">Hello,
      </div>
      <p>
      You're registered on Art Bazaar with the following e-mail: ayktkav@gmail.com. Someone has requested a link to change your password, and you can do this through the link below.
      </p>
      <div style="background-color: black; border-radius: 3px; min-height: 50px; width: 100%; cursor: pointer;">
        <a href="${baseURL}/reset_password?email=${email}&token=${token}&utm_campaign=accounts&utm_content=reset_password&utm_medium=email&utm_source=sendgrid" style="text-decoration: none; color: white; background-color: black; display: block; text-align: center; font-size: 16px; line-height: 22px; padding: 15px 0;">
        Update my password</a>
      </div>
      <p>This link is valid for 24 hours. If you didn't request this, please ignore this email.
      </p>
      <p>Your password won't change until you access the link above and create a new one.</p>
    </div>
  </div>
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
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "Verification email failed!",
      });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "Couldn't save verification email data!",
      });
    });
};

router.post("/reset_password", async (req, res) => {
  try {
    const { email } = req.body.forgotPasswordFormData;
    console.log("email:", email);
    const collector = await Collector.findOne({ email: email });

    if (!collector) {
      return res.status(404).json({ message: "Collector not found!" });
    }

    const token = createResetToken();
    const tokenExpiration = Date.now() + 86400000; // 24h valid token for password reset

    collector.resetPasswordToken = token;
    collector.resetPasswordExpires = tokenExpiration;
    await collector.save();

    sendForgotPasswordEmail(email, res, token);
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change_password", async (req, res) => {
  try {
    const { email, password, token } = req.body;
    console.log(email, password, token);

    if (!email || !password || !token) {
      return res
        .status(400)
        .json({ message: "Email, password and reset token are required" });
    }

    const collector = await Collector.findOne({
      email: email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!collector) {
      return res
        .status(404)
        .json({ message: "Invalid or expired reset token!" });
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!regex.test(password) || password.length < 8) {
      return res.status(400).json({
        message:
          "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    collector.password = await bcrypt.hash(password, salt);
    collector.resetPasswordToken = undefined;
    collector.resetPasswordExpires = undefined;

    await collector.save();
    console.log("updated collector:", collector);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/verify", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.redirect("/auth/verified?error=true&message=Invalid token");
    } else {
      const collectorId = decoded.collectorId;
      Collector.findByIdAndUpdate(collectorId, { verified: true })
        .then(() => {
          res.render("auth/verified");
        })
        .catch((error) => {});
    }
  });
});

module.exports = router;
