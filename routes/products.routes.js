const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", (req, res, next) => {
  Product.find()
    .then((productsFromDataBase) => {
      console.log(productsFromDataBase);
      res.render("products", { productArray: productsFromDataBase });
    })
    .catch((err) => {
      console.log(
        "An error occurred while fetching products from the DB:",
        err
      );
      res.status(500).send("An error occurred while fetching products");
    });
});

router.get("/:id", (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);
  Product.findById(productId)
    .then((product) => {
      res.render("product-details", { product: product });
    })
    .catch((err) => {
      console.log(
        "An error occurred while fetching the product from the DB:",
        err
      );
      res.status(500).send("An error occurred while fetching the product");
    });
});

router.post("/:id/carts", isLoggedIn, (req, res, next) => {
  const productId = req.params.id;
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .populate("carts")
    .then((user) => {
      user.carts.push(productId);
      return user.save();
    })
    .then(() => {
      res.redirect("/carts");
    })
    .catch((err) => {
      console.log(
        "An error occurred while adding the product to the cart:",
        err
      );
      res
        .status(500)
        .send("An error occurred while adding the product to the cart");
    });
});

module.exports = router;
