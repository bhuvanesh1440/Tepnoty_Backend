const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  value: { type: String, required: true,default:'' },
  expiresAt: { type: Date, required: true,default:'' },
});

module.exports = mongoose.model("OTP", otpSchema);
