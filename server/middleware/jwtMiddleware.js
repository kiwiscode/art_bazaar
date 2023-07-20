const jwt = require("jsonwebtoken");

// authenticateToken middleware fonksiyonu
module.exports = (req, res, next) => {
  // İstek başlığındaki Authorization bilgisini alın
  const authHeader = req.headers.authorization;
  // Authorization başlığından tokeni ayıklayın
  const token = authHeader && authHeader.split(" ")[1];

  // Token yoksa veya geçersizse hata döndürün
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Tokeni doğrulayın ve kullanıcı bilgilerini alın
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
