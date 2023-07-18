// const express = require("express");
// const router = express.Router();
// const isLoggedIn = require("../middleware/isLoggedIn");
// const User = require("../models/User.model");
// router.post("/", isLoggedIn, (req, res) => {
//   // Update the user's active status to false
//   User.findByIdAndUpdate(req.session.currentUser._id)
//     .then((user) => {
//       req.session.destroy((err) => {
//         console.log(err);
//         if (err) {
//           res.status(500).json({ errorMessage: err.message });
//           return;
//         }
//         req.session.currentUser.active = false;

//         console.log("AFTER LOGOUT USER:", req.session.currentUser);
//         console.log("//................//");
//         console.log("AFTER LOGOUT USER ID:", req.session.currentUser._id);
//         console.log("//................//");
//         // showing the cookie on the console
//         console.log("AFTER LOGOUT Active User :", req.session);
//         user.active = false;
//         user.save();

//         res.sendStatus(200);
//         // res.redirect("/");
//       });
//     })
//     .catch(
//       (err) => res.status(500).json({ errorMessage: err.message }),
//       console.log(err)
//     );
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

router.post("/", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;
    User.findByIdAndUpdate(userId, { active: false })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.status(500).json({ message: "Error updating user" });
      });
  });
});

module.exports = router;
