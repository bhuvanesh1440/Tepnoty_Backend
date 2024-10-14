const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createProblem,
  getUserProblems,
  deleteProblem,
} = require("../controllers/problemController");

const router = express.Router();

// Create a new problem
router.post("/report", protect, createProblem);

// Get problems of all user
router.get("/getAll", protect, getUserProblems);

// Get problems of the logged-in user
router.get("/", protect, getUserProblems);

// Delete a problem
router.delete("/:id", protect, deleteProblem);

module.exports = router;
