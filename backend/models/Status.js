const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetails",
    required: true,
  },
  type: { type: String, required: true }, // 'text', 'image', 'video'
  text: { type: String },
  mediaPath: { type: String },
  backgroundColor: { type: String }, // For text status
  fontSize: { type: String }, // For text status
  fontStyle: { type: String }, // For text status: 'normal', 'bold', 'italic'
  createdAt: { type: Date, default: Date.now, expires: "24h" },
});

module.exports = mongoose.model('Status', statusSchema);
