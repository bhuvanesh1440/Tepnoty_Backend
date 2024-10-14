const express = require("express");
const {
  submitInteraction,
  matchUsers,
} = require("../controllers/interactionController");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware

const router = express.Router();

router.post("/submit", protect, submitInteraction);
router.get("/match", protect, matchUsers);

module.exports = router;
