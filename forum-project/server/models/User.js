const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    deleted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
