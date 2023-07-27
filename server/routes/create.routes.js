const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

router.use(express.json());

router.post("/", authenticateToken, (req, res) => {
  console.log("Received POST request to /create");
  console.log("Request body:", req.body);
  console.log(req.user.userId);
  let {
    title,
    description,
    price,
    category,
    image,
    quantity,
    artist,
    period,
    signature,
    technique,
    username,
    userId,
  } = req.body;
  console.log(
    title,
    description,
    price,
    category,
    image,
    quantity,
    artist,
    period,
    signature,
    technique,
    username,
    userId
  );

  const newProduct = new Product({
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: req.body.image,
    quantity: req.body.quantity,
    artist: req.body.artist,
    period: req.body.period,
    signature: req.body.signature,
    technique: req.body.technique,
  });

  newProduct
    .save()
    .then((product) => {
      User.findByIdAndUpdate(
        req.user.userId,
        { $push: { works: product } },
        { new: true }
      ).then((updatedUser) => {
        console.log(updatedUser);
        res.status(201).json(product);
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    });
});

router.get("/", (req, res) => {
  res.render("create");
});

module.exports = router;
