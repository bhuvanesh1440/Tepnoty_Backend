const mongoose = require("mongoose");

const communitySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  connections: [
    { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails", default: [] },
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
