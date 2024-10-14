const Problem = require("../models/Problem");
const asyncHandler = require("express-async-handler");

// Create a new problem entry
const createProblem = asyncHandler(async (req, res) => {
  const { mediaType, mediaUrl, description } = req.body;

  const problem = new Problem({
    user: req.user._id,
    mediaType,
    mediaUrl,
    description,
  });

  const savedProblem = await problem.save();
  res.status(201).json(savedProblem);
});

// Get problems for a specific user
exports.getAllProblems = async (req, res) => {
    

    try {
        // Find problems reported by the specific user
        const feedback = await Problem.find({ });
        res.status(200).send(feedback);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching problems', error: error.message });
    }
};
// Get all problems for a user
const getUserProblems = asyncHandler(async (req, res) => {
  const problems = await Problem.find({ user: req.user._id });
  res.json(problems);
});

// Delete a problem
const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);

  if (!problem || problem.user.toString() !== req.user._id.toString()) {
    res.status(404).json({ message: "Problem not found" });
    return;
  }

  await problem.remove();
  res.json({ message: "Problem removed" });
});

module.exports = {
  createProblem,
  getUserProblems,
  deleteProblem,
};
