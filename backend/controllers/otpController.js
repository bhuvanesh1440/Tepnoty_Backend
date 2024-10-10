const asyncHandler = require("express-async-handler");
const OTP = require("../models/otp");

// Send OTP
exports.sendOtp = asyncHandler(async (req, res) => {
  const { user_id, value, expiresAt } = req.body;

  const otp = new OTP({ user: user_id, value, expiresAt });
  await otp.save();

  res.status(200).json({ success: true, message: "OTP sent" });
});

// Verify OTP
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { user_id, value } = req.body;
  const otp = await OTP.findOne({ user: user_id });

  if (otp && otp.value === value && otp.expiresAt > Date.now()) {
    res.status(200).json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
});
