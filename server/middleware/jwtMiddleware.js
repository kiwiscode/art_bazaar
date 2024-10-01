const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token || !token) {
    res.clearCookie("connect.sid", {
      host: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : "localhost",
      path: "/",
    });
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.collector = decoded;
    next();
  });
};
