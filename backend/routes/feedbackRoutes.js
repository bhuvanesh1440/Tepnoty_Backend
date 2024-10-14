const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to give feedback
router.post('/report', protect, feedbackController.reportFeedback);

// // Route to get problems for a specific user (GET /problems/:user_id)
router.get('/', protect,feedbackController.getAllFeedback );

router.get("/getAll", protect, feedbackController.getAllFeedback);

module.exports = router;
