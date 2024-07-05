const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

router.use(express.json());

router.post("/", authenticateToken, (req, res) => {
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
  } = req.body;

  if (
    title === "" ||
    description === " " ||
    price === "" ||
    category === "" ||
    image === "" ||
    quantity === "" ||
    quantity === "" ||
    artist === "" ||
    period === "" ||
    signature === "" ||
    technique === ""
  ) {
    res.status(403).json({
      errorMessage:
        "All fields are mandatory. Please provide all the necessary information about the product.",
    });
    return;
  }

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
      ).then(() => {
        res
          .status(200)
          .json(
            "The product has been successfully created and prepared for sale."
          );
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Server error" });
    });
});

router.get("/", (req, res) => {
  res.render("create");
});

module.exports = router;
