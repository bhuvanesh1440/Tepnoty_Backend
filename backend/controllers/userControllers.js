const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Phone number verification controller
exports.verifyPhoneNumber = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if phone number exists in the database
    const user = await User.findOne({ phoneNumber });

    if (user) {
      // If phone number exists
      return res.status(400).json({
        success: false,
        message: "Phone number already exists.",
      });
    }

    // If phone number doesn't exist
    return res.status(200).json({
      success: true,
      message: "Phone number is available.",
    });
  } catch (error) {
    // Error handling
    return res.status(500).json({
      success: false,
      message: "An error occurred while verifying the phone number.",
      error: error.message,
    });
  }
});
// Sign up controller
exports.signup = asyncHandler(async (req, res) => {
  try {
    const {
      phoneNumber,
      name,
      gender,
      dob,
      user_id,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    // Hash the password only once
    // const hashedPassword = await bcrypt.hash(password, 5);
    // console.log(hashedPassword); // Log the hashed password
    // password=hashedPassword.toString();

    const user = new User({
      phoneNumber,
      name,
      gender,
      dob,
      user_id,
      email,
      password
      // Use the hashed password here
    });

  

    await user.save();
    console.log("User saved:", user); // Log the user after saving
    // console.log(password==user.password)
    res
      .status(201)
      .send({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

exports.login = asyncHandler (async (req, res) => {
  const { phoneNumber, user_id, password } = req.body;
  const deviceVerification = req.header("deviceVerification");
  let user;

  try {
    // Check if user is logging in with phoneNumber or user_id
    if (phoneNumber) {
      user = await User.findOne({ phoneNumber });
    } else if (user_id) {
      user = await User.findOne({ user_id });
    }

    console.log(user)
    // Check if the user exists and password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jwt.sign(
        { user_id: user.user_id, deviceVerification: deviceVerification },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );

      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded", decoded);      
      // await user.save();

      // Send the response
      res.status(200).json({
        success:true,
        token,
        user_id: user.user_id,
        name: user.name,
      });
    } else {
      // If user is not found or password does not match
      res.status(401).json({success:false, message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle any errors during login
    console.error("Error in login:", error);
    res.status(500).json({success:false, message: "Server error" });
  }
});
// Reset the password after OTP verification
exports.resetPassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).send({success:false, message: 'Passwords do not match' });
    }

    try {
        user=req.user;

        if (!user) {
            return res.status(404).send({success:false, message: 'User not found' });
        }
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword;
        user.password=newPassword;

        await user.save();

        res.status(200).send({success:true, message: 'Password reset successful' });
    } catch (error) {
        console.error("Error in resetting password:", error);
        res.status(500).send({success:false, message: 'Server error' });
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
    if (deviceId == device) {
      const newToken = jwt.sign(
        { user_id: decoded.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
      );
      res.status(200).send({success:true, newToken: newToken });
    } else {
      res.status(500).send({success:false, message: "Authorization Failed" });
    }
  } catch (error) {
    res
      .status(500)
      .send({success:false, error: "Failed to refresh token", message: error.message });
  }
})



exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ user_id: req.user.user_id });
  res.status(200).send({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    dob: user.dob,
  });
});
exports.editProfile =asyncHandler( async (req, res) => {
  try {
    const { name, gender, dob, email, phoneNumber } = req.body;
    const user = await User.findOne({ user_id: req.user.user_id });

    if (!user) {
      return res.status(404).send({isUpdated:fasle, message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // If password is provided, update it after hashing
    // if (password) {
    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     user.password = hashedPassword;
    // }

    await user.save();

    res
      .status(200)
      .send({
        isUpdated:true,
        message: "Profile updated successfully",
        user:{user_id: user.user_id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        dob: user.dob,}
      });
  } catch (error) {
    console.error("Error in editProfile:", error);
    res.status(500).send({isUpdated:false, message: "Server error" });
  }
})
exports.deleteProfile = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { primary_reason, improvement_feedback } = req.body;


    // Check if primary_reason and improvement_feedback are provided
    if (!primary_reason || !improvement_feedback) {
      return res
        .status(400)
        .send({
          error: "Primary reason and improvement feedback are required.",
        });
    }


    // Deleting the user from the User schema
    const deletedUser = await User.findOneAndDelete({ user_id });

    if (!deletedUser) {
      return res
        .status(404)
        .send({success:false, error: "User not found or already deleted." });
    }

    // If successful
    res.status(200).send({success:true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send({success:false, error: "Failed to delete account." });
  }
})


exports.allUsers = asyncHandler(async (req, res) => {
  console.log(req.query.search);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password -otp");

  res.send(users);
});


