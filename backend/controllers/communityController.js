const asyncHandler = require("express-async-handler");
const Community = require("../models/community");

// Add a follower
exports.follow = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  const community = await Community.findOne({ user: req.user.user_id });

  if (!community.following.includes(user_id)) {
    community.following.push(user_id);
    await community.save();
  }

  res.status(200).json({ success: true, message: "User followed" });
});

// Block a user
exports.blockUser = asyncHandler(async (req, res) => {
  const { user_id } = req.body;
  const community = await Community.findOne({ user: req.user.user_id });

  if (!community.blockedUsers.includes(user_id)) {
    community.blockedUsers.push(user_id);
    await community.save();
  }

  res.status(200).json({ success: true, message: "User blocked" });
});
