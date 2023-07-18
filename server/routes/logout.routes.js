const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
router.post("/", isLoggedIn, (req, res) => {
  // Update the user's active status to false
  User.findByIdAndUpdate(req.session.currentUser._id, { active: false })
    .then((user) => {
      req.session.destroy((err) => {
        if (err) {
          // res.status(500).json({ errorMessage: err.message });
          console.log(err);
          return;
        }

        // user.active = false;
        user.save();

        // res.sendStatus(200);
        res.redirect("/");
      });
    })
    .catch((err) =>
      // res.status(500).json({ errorMessage: err.message }),
      console.log(err)
    );
});

module.exports = router;
