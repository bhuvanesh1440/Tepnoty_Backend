const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  connections: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" },
      status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
      },
    },
  ],
  followers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", default: [] },
  ],
  following: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", default: [] },
  ],
  blockedUsers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", default: [] },
  ],
});

module.exports = mongoose.model("Community", communitySchema);
