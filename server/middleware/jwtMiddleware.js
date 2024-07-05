const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
<<<<<<< HEAD

  const token = authHeader && authHeader.split(" ")[1];

=======
  const token = authHeader && authHeader.split(" ")[1];

  if (token || !token) {
    res.clearCookie("connect.sid", { host: "localhost", path: "/" });
  }

>>>>>>> development
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
