const asyncHandler = require("express-async-handler");
const Community = require("../models/community");

// Block a user
const blockUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { blockUserId } = req.body;

  try {
    const community = await Community.findOne({ user: userId });
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    if (!community.blockedUsers.includes(blockUserId)) {
      community.blockedUsers.push(blockUserId);
      await community.save();
    }

    res
      .status(200)
      .json({ success: true, message: "User blocked successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error blocking the user.",
      error: error.message,
    });
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { unblockUserId } = req.body;

  try {
    const community = await Community.findOne({ user: userId });
    console.log(community)
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    community.blockedUsers = community.blockedUsers.filter(
      (id) => id.toString() != unblockUserId
    );
    await community.save();

    console.log(community)

    res
      .status(200)
      .json({ success: true, message: "User unblocked successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error unblocking the user.",
      error: error.message,
    });
  }
});

// Get all blocked users of a user
const getBlockedUsers = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const community = await Community.findOne({ user: userId }).populate("blockedUsers");

    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found." });
    }

    res.status(200).json({ success: true, blockedUsers: community.blockedUsers });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});



// Follow a user
const followUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { followUserId } = req.body;

  try {
    const community = await Community.findOne({ user: userId });
    console.log(community)
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    if (!community.following.includes(followUserId)) {
      community.following.push(followUserId);
    }

    const followedCommunity = await Community.findOne({ user: followUserId });

    if (!followedCommunity) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Followed user's community not found.",
        });
    }

    if (!followedCommunity.followers.includes(userId)) {
      followedCommunity.followers.push(userId);
    }

    await community.save();
    await followedCommunity.save();

    res
      .status(200)
      .json({ success: true, message: "User followed successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error following the user.",
      error: error.message,
    });
  }
});

// Unfollow a user
const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { unfollowUserId } = req.body;

  try {
    const community = await Community.findOne({ user: userId });
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    community.following = community.following.filter(
      (id) => id.toString() !== unfollowUserId
    );

    const followedCommunity = await Community.findOne({ user: unfollowUserId });
    if (!followedCommunity) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Followed user's community not found.",
        });
    }
    console.log(userId)
    console.log(followedCommunity.followers.filter(
      (id) => id.toString() !== userId
    ))
    followedCommunity.followers = followedCommunity.followers.filter(
      (id) => id.toString() != userId
    );

    await community.save();
    await followedCommunity.save();
    // console.log(community)
    console.log(followedCommunity)

    res
      .status(200)
      .json({ success: true, message: "User unfollowed successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error unfollowing the user.",
      error: error.message,
    });
  }
});

// Get all followers of a user
const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const community = await Community.findOne({ user: userId }).populate(
      "followers"
    );
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    res.status(200).json({ success: true, followers: community.followers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving followers.",
      error: error.message,
    });
  }
});

// Get all following of a user
const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const community = await Community.findOne({ user: userId }).populate(
      "following"
    );
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    res.status(200).json({ success: true, following: community.following });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving following users.",
      error: error.message,
    });
  }
});

// Get all pending connection requests
const getPendingConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const community = await Community.findOne({ user: userId });
    if (!community) {
      return res.status(404).json({ success: false, message: "Community not found." });
    }

    // Retrieve only pending connections
    const pendingConnections = community.connections.filter(
      (conn) => conn.status === "pending"
    );

    res.status(200).json({ success: true, pendingConnections });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving pending connections.",
      error: error.message,
    });
  }
});

// Send connection request
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const user1Id = req.user._id; // user1 (the sender)
  const { connectUserId: user2Id } = req.body; // user2 (the recipient)

  // Find user1's community object
  const user1Community = await Community.findOne({ user: user1Id });

  // Find user2's community object
  const user2Community = await Community.findOne({ user: user2Id });

  if (!user2Community) {
    return res.status(404).json({ message: "User2's community not found." });
  }

  // Check if the connection already exists (to avoid duplicates)
  const existingConnection = user2Community.connections.find(
    (conn) => conn.user.toString() === user1Id
  );
  if (existingConnection) {
    return res.status(400).json({ message: "Connection request already sent." });
  }

  // Add connection request to user2's community as 'pending'
  user2Community.connections.push({ user: user1Id, status: "pending" });
  await user2Community.save();

  res.status(200).json({ message: "Connection request sent to user2." });
});


// Accept connection request
const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const user2Id = req.user._id; // user2 (the recipient)
  const { connectUserId: user1Id } = req.body; // user1 (the sender)

  // Find user2's community object
  const user2Community = await Community.findOne({ user: user2Id });

  // Find the pending request from user1
  const connection = user2Community.connections.find(
    (conn) => conn.user.toString() === user1Id && conn.status === "pending"
  );

  if (!connection) {
    return res.status(404).json({ message: "No pending connection request found." });
  }

  // Update the status to accepted in user2's community
  connection.status = "accepted";
  await user2Community.save();

  // Now add mutual connection for user1 in their community
  const user1Community = await Community.findOne({ user: user1Id });
  user1Community.connections.push({ user: user2Id, status: "accepted" });
  await user1Community.save();

  res.status(200).json({ message: "Connection accepted. Both are now mutual connections." });
});

// Get all connections
const getConnections = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const community = await Community.findOne({ user: userId }).populate(
      "connections.user"
    );
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found." });
    }

    const acceptedConnections = community.connections.filter(
      (conn) => conn.status === "accepted"
    );

    res.status(200).json({ success: true, connections: acceptedConnections });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving connections.",
      error: error.message,
    });
  }
});

module.exports = {
  blockUser,
  unblockUser,
  getBlockedUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getPendingConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  getConnections,
};
