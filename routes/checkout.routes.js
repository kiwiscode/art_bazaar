const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.render("checkout");
});

module.exports = router;
