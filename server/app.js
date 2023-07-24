// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

const session = require("express-session");

const methodOverride = require("method-override");

// 1. require the body-parser
const bodyParser = require("body-parser");
// 2. let know your app you will be using it
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "UserName",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.locals.loggedInUsername = req.session.loggedInUsername;
  next();
});

hbs.registerHelper("priceSum", function (arr) {
  const totalPrice = arr.reduce((acc, curr) => acc + curr.price, 0);
  return totalPrice.toFixed(2);
});

app.use(methodOverride("_method"));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "my-fullstack-project";

app.locals.appTitle = `${capitalize(projectName)}`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/products.routes");
app.use("/products", productRoutes);

const cartRoutes = require("./routes/carts.routes");
app.use("/carts", cartRoutes);

const checkoutRoutes = require("./routes/checkout.routes");
app.use("/checkout", checkoutRoutes);

const verifiedRoutes = require("./routes/verified.routes");
app.use("/verified", verifiedRoutes);

const logoutRoutes = require("./routes/logout.routes");
app.use("/auth/logout", logoutRoutes);

const stripeRoutes = require("./routes/stripe.routes");
app.use("/stripe", stripeRoutes);

const successRoutes = require("./routes/success.routes");
app.use("/checkout-success", successRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
