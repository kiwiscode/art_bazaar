const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
router.use(express.json());

router.get("/my-works", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  User.findById(userId)
    .populate("works")
    .then((user) => {
      const works = user.works;

      res.json(works);
    })
    .catch((error) => {
      console.error("Error fetching works:", error);
      res.status(500).json({ message: "Server error" });
    });
});

router.patch(
  "/:userId/welcome-modal-status",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedUser = await User.findByIdAndUpdate(
        userId, // Use _id to find the user to update
        { isWelcomeModalShowed: true }, // Field to update and its value
        { new: true } // To return the updated document, use { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
