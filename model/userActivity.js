const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    result: { type: String, required: true, trim: true },
    attempt: { type: Number, required: true, min: 0 },
    strengths: { type: String, trim: true, default: '' },
    weaknesses: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserActivity', userActivitySchema);


