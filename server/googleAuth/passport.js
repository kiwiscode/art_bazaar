const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const capitalize = require("../utils/capitalize");
const Collector = require("../models/Collector.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      try {
        let collector = await Collector.findOne({
          email: profile.emails[0].value,
        });
        if (!collector) {
          let name = profile.displayName;
          let email = profile.emails[0].value;
          let password = profile.id;

          if (name) {
            name = capitalize(name);
          }

          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);

          collector = await Collector.create({
            name,
            email,
            password: hashedPassword,
            verified: true,
            active: true,
          });

          console.log("collector created");
        } else {
          collector.active = true;
          await collector.save();
        }

        callback(null, collector);
      } catch (err) {
        callback(err, null);
      }
    }
  )
);

passport.serializeUser((collector, done) => {
  done(null, collector.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const collector = await Collector.findById(id);
    console.log("collector:", collector);
    done(null, collector);
  } catch (err) {
    done(err, null);
  }
});
module.exports = passport;
