const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Password hashing middleware
passwordSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
passwordSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Password", passwordSchema);
