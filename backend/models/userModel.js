const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    user_id: { type: String, required: true, unique: true }, // Ensure user_id is defined and unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp:{
      value:{type:String},
      expiresAt:{type:Date}
    },
    community: {
      connections: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
      ],
      followers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
      ],
      following: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
      ],
      blockedUsers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
      ],
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
