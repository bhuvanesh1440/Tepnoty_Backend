const mongoose = require("mongoose");

const interactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDetails",
      required: true,
    },
    role: { type: String, enum: ["seeker", "provider"], required: true },
    ageGroup: { type: String, required: true },
    encounters: { type: String, required: true },
    concerns: { type: String, required: true },
    preferredLanguage: { type: String, required: true },
    age: { type: Number, required: true }, // Added age field
  },
  { timestamps: true }
);

const Interaction = mongoose.model("Interaction", interactionSchema);
module.exports = Interaction;
