const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");

router.patch(
  "/:userId/welcome-modal-status",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isWelcomeModalShowed: true },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
