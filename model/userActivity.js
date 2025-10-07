const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    result: { type: String, required: true, trim: true },
    attempt: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserActivity', userActivitySchema);


