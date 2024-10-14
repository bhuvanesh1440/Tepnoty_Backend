const OTP = require("../models/otp");
const UserDetails = require("../models/userDetails");
const crypto = require("crypto");

//generate otp
exports.generateOTP = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Validate input
    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Email or Phone number is required" });
    }

    // Find the user by email or phone number
    let user;
    if (email) {
      user = await UserDetails.findOne({ email });
    } else if (phoneNumber) {
      user = await UserDetails.findOne({ phoneNumber });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otpValue = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otpValue);

    // Set OTP expiration (2 minutes from now)
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Check if OTP already exists for this user
    let otp = await OTP.findOne({ user: user._id });

    if (otp) {
      // If OTP exists, update it
      otp.value = otpValue;
      otp.expiresAt = expiresAt;
    } else {
      // If no OTP exists, create a new one
      otp = new OTP({
        user: user._id,
        value: otpValue,
        expiresAt: expiresAt,
      });
    }

    await otp.save();

    res.status(201).json({
      message: "OTP generated successfully",
      success: true,
    });

    // You can also send the OTP via email or SMS using third-party services like SendGrid, Twilio, etc.
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating OTP",
      error: error.message,
    });
  }
};
// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, phoneNumber, otpValue } = req.body;

    // Validate input
    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Email or Phone number is required" });
    }

    // Find the user by email or phone number
    let user;
    if (email) {
      user = await UserDetails.findOne({ email });
    } else if (phoneNumber) {
      user = await UserDetails.findOne({ phoneNumber });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the OTP for the user
    const otp = await OTP.findOne({ user: user._id, value: otpValue });

    if (!otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (otp.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // OTP is valid
    res.status(200).json({success:true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error verifying OTP",
        error: error.message,
      });
  }
};
