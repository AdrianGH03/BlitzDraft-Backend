const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default: '6100.png',
  },
  totalPointsEarned: Number,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  points: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);