const asyncHandler = require("express-async-handler");
const Interaction = require("../models/Interaction"); // Adjust the path as necessary
const UserDetails = require("../models/userDetails"); // Adjust the path as necessary

// Submit interaction answers
const submitInteraction = asyncHandler(async (req, res) => {
  const { role, ageGroup, encounters, concerns, preferredLanguage } = req.body;
  const userId = req.user._id; // Assuming user ID is attached to req.user

  // Fetch user age from user details
  const userDetails = await UserDetails.findOne({ _id:userId });
  if (!userDetails) {
    return res.status(404).json({ message: "User details not found." });
  }

  const interaction = new Interaction({
    userId,
    role,
    ageGroup,
    encounters,
    concerns,
    preferredLanguage,
    age: userDetails.age, // Assuming age is a field in UserDetails schema
  });

  await interaction.save();
  res.status(201).json({ message: "Interaction saved successfully." });
});

// Match users
const matchUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id; // User requesting the match
  const userInteraction = await Interaction.findOne({ userId });

  if (!userInteraction) {
    return res
      .status(404)
      .json({ message: "No interaction found for the user." });
  }

  // Define age group ranges
  const ageRanges = {
    "16-25 Yrs": [16, 25],
    "25-40 Yrs": [25, 40],
    "41-60 Yrs": [41, 60],
    "60 above": [60, 120], // Assuming 120 as an upper limit
  };

  let ageRange = ageRanges[userInteraction.ageGroup];

  if (!ageRange) {
    return res.status(400).json({ message: "Invalid age group selected." });
  }

  // Match logic with age condition
  const matches = await Interaction.find({
    role: userInteraction.role === "seeker" ? "provider" : "seeker",
    age: { $gte: ageRange[0], $lte: ageRange[1] }, 
    encounters: userInteraction.encounters,
    preferredLanguage: userInteraction.preferredLanguage,
  }).populate("userId");
    console.log(userInteraction);

  if (matches.length === 0) {
    return res.status(404).json({ message: "No matches found." });
  }

  const matchDetails = matches.map((match) => ({
    userId: match.userId,
    age: match.age,
    role: match.role,
    encounters: match.encounters,
    concerns: match.concerns, // Include concerns
    preferredLanguage: match.preferredLanguage,
  }));

  res.status(200).json(matchDetails);
});


module.exports = { submitInteraction, matchUsers };
