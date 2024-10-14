const express = require("express");
const {
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
} = require("../controllers/communityController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/block",protect, blockUser);
router.post("/unblock",protect, unblockUser);
router.get("/blocked-users", protect, getBlockedUsers);
router.post("/follow",protect, followUser);
router.post("/unfollow",protect, unfollowUser);
router.get("/followers",protect, getFollowers);
router.get("/following",protect, getFollowing);
router.post("/connect",protect, sendConnectionRequest);
router.post("/accept",protect, acceptConnectionRequest);
router.get("/pending-connections",protect, getPendingConnections);
router.get("/connections",protect, getConnections);

module.exports = router;
