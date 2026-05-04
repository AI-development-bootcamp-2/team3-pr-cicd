const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, trim: true },
    // BUG: password field has no `select: false` — any query that doesn't
    // explicitly project it out will include the bcrypt hash in the result.
    // If a controller does res.json(user) the hash is sent to the client.
    password: { type: String, required: true },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '' },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
    deleted:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
