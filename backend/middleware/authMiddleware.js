const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if the Authorization header is provided and contains a token
    const token = req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Token missing. Please authenticate." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if deviceVerification header is present
    const deviceVerificationHeader = req.header("deviceVerification");
    if (!deviceVerificationHeader) {
      return res
        .status(400)
        .json({ error: "Device verification header is missing." });
    }

    // Compare deviceVerification from token and header
    if (decoded.deviceVerification !== deviceVerificationHeader) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Device verification mismatch." });
    }

    // Find the user based on the decoded user_id
    const user = await User.findOne({ user_id: decoded.user_id });

    // If no user is found, throw an error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Attach token and user info to request object
    req.token = token;
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch any error related to token or authentication
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ error: "Invalid token or authentication failed." });
  }
});

module.exports = { protect };
