const mongoose = require("mongoose");

const deletedUsersSchema = mongoose.Schema(
  {
    userDetails: {
      phoneNumber: { type: String, required: true}, //, unique: true },
      name: { type: String, required: true },
      gender: { type: String, required: true },
      dob: { type: Date, required: true },
      user_id: { type: String, required: true},//, unique: true }, // Unique user identifier
      email: { type: String, required: true}//, unique: true },
    },
    primary_reason: { type: String, require: true },
    improvement_feedback: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("deletedUsers", deletedUsersSchema);
