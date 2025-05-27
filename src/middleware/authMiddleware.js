const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
const authHeader = req.headers.authorization;
console.log("jkhgvgvg")


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, not authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    console.log(req.user,"req.user")

    // if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
    console.log("opopopo")
  } catch (error) {
    console.log("hgfhgh")
    res.status(401).json({ message: "Token failed" });
  }
};

module.exports = { protect };
