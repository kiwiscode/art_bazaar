const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
router.use(express.json());

router.get("/my-works", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  User.findById(userId)
    .populate("works")
    .then((user) => {
      console.log(user);
      // Kullanıcının works array'indeki tüm ürünleri alın
      const works = user.works;
      console.log(works);
      // Çalışmaları yanıt olarak döndürün
      res.json(works);
    })
    .catch((error) => {
      console.error("Error fetching works:", error);
      res.status(500).json({ message: "Server error" });
    });
});

router.get("/:id", (req, res) => {
  res.render("/artist-profile");
});

module.exports = router;
