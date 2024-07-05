require("dotenv").config();
require("./db");
const path = require("path");

const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
const session = require("express-session");

require("./googleAuth/passport");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.set("views", path.join(__dirname, "./", "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./", "public")));

// google auth
app.use(
  session({
    secret: "kiwisc0de",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);
app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const artsyApiRoutes = require("./routes/artsy_api.routes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api", artsyApiRoutes);

module.exports = app;
