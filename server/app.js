require("dotenv").config();
require("./db");
const path = require("path");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const passport = require("passport");
const session = require("express-session");

require("./googleAuth/passport");

const bodyParser = require("body-parser");
// for entity too large error limitation
app.use(bodyParser.json({ limit: "30mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
    parameterLimit: 30000,
  })
);

const FRONTEND_URL = process.env.FRONTEND_URL;

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(morgan("dev"));

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
const collectorRoutes = require("./routes/collectors.routes");
const artistRoutes = require("./routes/artist.routes");
const artworkRoutes = require("./routes/artwork.routes");
const purchaseRoutes = require("./routes/purchase.routes");

app.use("/auth", authRoutes);
app.use("/collectors", collectorRoutes);
app.use("/artist", artistRoutes);
app.use("/artwork", artworkRoutes);
app.use("/purchase", purchaseRoutes);

module.exports = app;
