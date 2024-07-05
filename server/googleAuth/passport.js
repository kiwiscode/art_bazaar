const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const capitalize = require("../utils/capitalize");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          let name = profile.displayName;
          let email = profile.emails[0].value;
          let password = profile.id;

          if (name) {
            name = capitalize(name);
          }

          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);

          user = await User.create({
            name,
            email,
            password: hashedPassword,
            verified: true,
            active: true,
          });

          console.log("user created");
        } else {
          user.active = true;
          await user.save();
        }

        callback(null, user);
      } catch (err) {
        callback(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("user:", user);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
module.exports = passport;
