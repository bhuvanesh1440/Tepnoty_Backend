const asyncHandler = require("express-async-handler");
const UserDetails = require("../models/userDetails");
const Password = require("../models/password"); 
const deletedUsers = require('../models/deletedUsers')
const bcrypt = require("bcrypt");
const userDetails = require("../models/userDetails");
const password = require("../models/password");


// Phone number verification controller
exports.verifyPhoneNumber = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if phone number exists in the database
    const user = await UserDetails.findOne({ phoneNumber });

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

// Phone number verification controller
exports.verifyUserId = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  try {
    // Check if phone number exists in the database
    const user = await UserDetails.findOne({ user_id });

    if (user) {
      // If phone number exists
      return res.status(400).json({
        success: false,
        message: "userId already exists.",
      });
    }

    // If phone number doesn't exist
    return res.status(200).json({
      success: true,
      message: "UserId is available.",
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
      age,
      user_id,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Check if the user already exists
    const existingUser = await UserDetails.findOne({ user_id });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    // Create and save the user's details
    const user = new UserDetails({
      phoneNumber,
      name,
      gender,
      dob,
      age,
      user_id,
      email,
    });

    await user.save();
    console.log(user)
    // After saving user details, handle the password
    const existingPassword = await Password.findOne({ user: user._id });
    if (existingPassword) {
      return res
        .status(400)
        .json({ success: false, message: "User password already exists" });
    }

    // Hash the password
    const newPassword = new Password({
      user: user._id,
      password: password,
      phoneNumber:phoneNumber
    });

    // Save the password
    await newPassword.save();

    // Create a new community object for the user
    const community = new Community({
      user: user._id,
    });

    await community.save();

    // Successful registration response
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// isEmailVerified to true
 exports.verifyEmail = asyncHandler(async (req, res) => {
  const  userId  = req.user._id;
  try {
    // Find the user by userId
    const user = await UserDetails.findOne({ _id: userId });

    // Check if user exists
    if (!user) {
      return res.status(404).json({success:false, message: "User not found" });
    }

    // Check if the email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({success:false, message: "Email is already verified" });
    }

    // Update the isEmailVerified field to true
    user.isEmailVerified = true;
    await user.save();

    // Send a successful response
    res.status(200).json({
      success:true,
      message: "Email verified successfully",
      
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({success:false, message: "Server error", error: error.message });
  }
});





// Get profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await UserDetails.findOne({ user_id: req.user.user_id });
  res.status(200).json(
    user
    // {
    // user_id: user.user_id,
    // name: user.name,
    // email: user.email,
    // phoneNumber: user.phoneNumber,
    // gender: user.gender,
    // dob: user.dob,
  // }
);
});
// Edit profile
exports.editProfile = asyncHandler(async (req, res) => {
  const {user_id, name, gender, dob, email, phoneNumber } = req.body;
  const user = await UserDetails.findOne({ user_id: req.user.user_id });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (user_id) user.user_id = user_id;
  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (dob) user.dob = dob;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dob: user.dob,
    },
  });
});
// Delete profile
exports.deleteProfile = asyncHandler(async (req, res) => {
  try {
    const user_id = req.user.user_id;
    let user=req.user

    const { primary_reason, improvement_feedback } = req.body;

    // Check if primary_reason and improvement_feedback are provided
    if (!primary_reason || !improvement_feedback) {
      return res.status(400).send({
        error: "Primary reason and improvement feedback are required.",
      });
    }

    // Deleting the user from the User schema
    const deletedUser = await userDetails.findOneAndDelete({ user_id });
    const deletePassword = await password.findOneAndDelete({ user:user._id });


    if (!deletedUser || !deletePassword) {
      return res
        .status(404)
        .send({ success: false, error: "User not found or already deleted." });
    }

    const delUser = new deletedUsers({
        userDetails:user,
        primary_reason:primary_reason,
        improvement_feedback:improvement_feedback
    })

        await delUser.save();

    // If successful
    res
      .status(200)
      .send({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .send({ success: false, error: "Failed to delete account." });
  }
});




const Community = require("../models/community");

// Get Random Mutual Connections
exports.getRandomMutualConnections = async (req, res) => {
  try {
    const { userId } = req.user._id; // User whose mutuals we are finding

    // Find the community data of the user
    const userCommunity = await Community.findOne({ _id: userId }).populate(
      "connections.user"
    );

    if (!userCommunity) {
      return res.status(404).json({ message: "User community not found" });
    }

    // Get the user's connections
    const userConnections = userCommunity.connections
      .filter((conn) => conn.status === "accepted")
      .map((conn) => conn.user);

    // Initialize an array to store mutuals
    let mutualConnections = [];

    // Loop through each connection and find their accepted connections
    for (let connection of userConnections) {
      const connectionCommunity = await Community.findOne({
        user: connection._id,
      }).populate("connections.user");

      if (connectionCommunity) {
        const connectionConnections = connectionCommunity.connections
          .filter(
            (conn) =>
              conn.status === "accepted" && conn.user._id.toString() !== userId
          )
          .map((conn) => conn.user._id.toString());

        // Check for mutuals - connections who are also connected with the user
        const mutuals = connectionConnections.filter((connId) =>
          userConnections.some((userConn) => userConn._id.toString() === connId)
        );

        mutualConnections.push(...mutuals);
      }
    }

    // Remove duplicates
    mutualConnections = [...new Set(mutualConnections)];

    // Get random mutual connections (let's say we return 5)
    const randomMutuals = mutualConnections
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    // Populate the mutuals with user details
    const randomMutualUsers = await UserDetails.find({
      _id: { $in: randomMutuals },
    });

    res.status(200).json({
      message: "Random mutual connections retrieved successfully",
      mutuals: randomMutualUsers,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving mutual connections",
        error: error.message,
      });
  }
};

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

  const users = await userDetails.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password -otp");

  res.send(users);
});