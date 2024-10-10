const asyncHandler = require("express-async-handler");
const UserDetails = require("../models/userDetails");
const Password = require("../models/password");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign up
exports.signup = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;

  const existingPassword = await Password.findOne({ user: user_id });
  if (existingPassword) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newPassword = new Password({ user: user_id, password: hashedPassword });

  await newPassword.save();
  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
});

exports.login = asyncHandler(async (req, res) => {
  const { phoneNumber, user_id, password } = req.body;
  const deviceVerification = req.header("deviceVerification");
  let user;

  try {
    // Check if user is logging in with phoneNumber or user_id
    if (phoneNumber) {
      user = await Password.findOne({ phoneNumber }).populate("user");
    } else if (user_id) {
      user = await Password.findOne({ user_id }).populate("user");
    }

    console.log(user.user.user_id);

    // Check if the user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.user._id, deviceVerification: deviceVerification },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      // await user.save();

      // Send the response
      res.status(200).json({
        success: true,
        token,
        user_id: user.user.user_id,
        name: user.user.name,
      });
    } else {
      // If user is not found or password does not match
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle any errors during login
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Reset the password after OTP verification
exports.resetPassword = asyncHandler(async (req, res) => {
    console.log("hello")
  const { newPassword, confirmPassword } = req.body;
  console.log(req.body);

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .send({ success: false, message: "Passwords do not match" });
  }

  try {
    user = req.user;

    console.log(user);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    const existingPassword = await Password.findOne({ user: user._id });

    existingPassword.password = newPassword;

    await existingPassword.save();

    res
      .status(200)
      .send({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

exports.refresh = asyncHandler(async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);

    if (!token) {
      return res.status(400).send({ error: "Token is required" });
    }
    const deviceId = req.header("deviceVerification");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const device = decoded.deviceVerification;
    console.log(decoded)
    if (deviceId == device) {
      const newToken = jwt.sign(
        { user_id: decoded.user_id, deviceVerification: decoded.deviceVerification },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      console.log(jwt.verify(newToken, process.env.JWT_SECRET));
      res.status(200).send({ success: true, newToken: newToken });
    } else {
      res.status(500).send({ success: false, message: "Authorization Failed" });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        success: false,
        error: "Failed to refresh token",
        message: error.message,
      });
  }
});
