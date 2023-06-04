const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const auth = async (req, res, next) => {
  let token;

  // Check if auth headers exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({
          message: "Auth failed! Token not authentic.",
          status: "Failed",
        });
      }

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Server Error!");
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Auth failed! No token found!", status: "Failed" });
  }
};

module.exports = auth;
