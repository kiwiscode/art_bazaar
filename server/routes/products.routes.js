const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/:id/carts", authenticateToken, (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user.userId; // authenticateToken middleware'ı tarafından sağlanan kullanıcı bilgilerini kullanın

  User.findById(userId)
    .populate("carts")
    .then((user) => {
      if (!user.active) {
        return res.status(401).json({ message: "User is not active" });
      }

      user.carts.push(productId);
      return user.save();
    })
    // .then(() => {
    //   res.redirect("/carts");
    // })
    .catch((err) => {
      res
        .status(500)
        .send("An error occurred while adding the product to the cart");
    });
});

router.get("/:id", (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      res.status(500).send("An error occurred while fetching the product");
    });
});
router.get("/", (req, res, next) => {
  Product.find()
    .then((productsFromDataBase) => {
      res.json(productsFromDataBase);
    })
    .catch((err) => {
      res.status(500).send("An error occurred while fetching products");
    });
});

module.exports = router;
