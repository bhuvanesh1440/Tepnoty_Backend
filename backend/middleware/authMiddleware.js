const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
// const isTokenBlacklisted = require('./tokenMiddleware.js')

const protect = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  // Check if token is blacklisted
  // const blacklisted = await isTokenBlacklisted(token);
  // console.log(blacklisted)
  // if (blacklisted) {
  //   return res
  //     .status(401)
  //     .json({ success: false, message: "Token is invalidated" });
  // }
  // Extract the deviceVerification from the request headers
  const deviceVerificationHeader = req.header("deviceVerification");

  try {
    // Verify the JWT token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    // Check if deviceVerification from the token matches the one from the header
    if (decoded.deviceVerification !== deviceVerificationHeader) {
       res
        .status(401)
        .json({ error: "Unauthorized: Device verification mismatch." });
    }

    // Find the user based on the decoded user_id
    const user = await User.findOne({ user_id: decoded.user_id });

    // If no user is found, throw an error
    if (!user) {
      throw new Error("User not found");
    }

    // Attach the token and user information to the request object
    req.token = token;
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Please authenticate." });
  }
});

module.exports = { protect };
