const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");

router.get("/", authenticateToken, (req, res) => {
  res.render("success");
});

module.exports = router;
