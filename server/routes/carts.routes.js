const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, (req, res, next) => {
<<<<<<< HEAD
  // Rotaya JWT doğrulaması eklendiği için, req.user üzerinden kullanıcının bilgilerine erişebiliriz
=======
>>>>>>> development
  const userId = req.user.userId;

  User.findById(userId)
    .populate("carts")
    .then((user) => {
      res.json({ carts: user.carts });
    })
    .catch((err) => {
      res.status(500).send("An error occurred while fetching the cart");
    });
});

router.delete("/:id", authenticateToken, (req, res, next) => {
  const userId = req.user.userId;
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
      res.json({
        status: "DONE",
        message: "ITEM DELETED",
      });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "There is a problem deleting",
      });
      res
        .status(500)
        .send("An error occurred while removing the product from cart");
    });
});

router.get("/checkout", authenticateToken, (req, res, next) => {
  const userId = req.user.userId;
  User.findById(userId)
    .populate("carts")
    .then((user) => {
      res.json({ carts: user.carts });
    })
    .catch((err) => {
      res
        .status(500)
        .send("An error occurred while fetching the cart for checkout");
    });
});

module.exports = router;
