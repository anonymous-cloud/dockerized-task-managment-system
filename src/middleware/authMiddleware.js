const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authJwt = async (req, res, next) => {
const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, not authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = { authJwt };
