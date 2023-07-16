const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");

const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", (req, res, next) => {
  const userId = req.session.currentUser._id;
  User.findById(userId)
    .populate("carts") // carts dizisindeki ürünleri popüle ediyoruz
    .then((user) => {
      // { _id, title, description, price, category, rating, image, quantity }
      res.render("carts", { user: user }); // carts.hbs şablonuna kullanıcıyı ve sepeti geçiriyoruz
    })
    .catch((err) => {
      console.log("An error occurred while fetching the cart:", err);
      res.status(500).send("An error occurred while fetching the cart");
    });
});

router.delete("/:id", (req, res, next) => {
  const userId = req.session.currentUser._id;
  const productId = req.params.id;

  User.findById(userId)
    .then((user) => {
      const index = user.carts.findIndex(
        (cart) => cart.toString() === productId
      );
      if (index !== -1) {
        user.carts.splice(index, 1);
      }
      return user.save();
    })
    .then(() => {
      console.log(productId);
      res.redirect("/carts");
    })
    .catch((err) => {
      console.log(
        "An error occurred while removing the product from cart:",
        err
      );
      res
        .status(500)
        .send("An error occurred while removing the product from cart");
    });
});

router.get("/checkout", (req, res, next) => {
  const userId = req.session.currentUser._id;

  User.findById(userId)
    .populate("carts")
    .then((user) => {
      res.render("checkout", { user: user });
    })
    .catch((err) => {
      console.log(
        "An error occurred while fetching the cart for checkout:",
        err
      );
      res
        .status(500)
        .send("An error occurred while fetching the cart for checkout");
    });
});

module.exports = router;
