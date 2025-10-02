const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    default: "",
    trim: true
  },
  avatarUrl: {
    type: String,
    default: "",
    validate: {
      validator: function(v) {
        if (v === "") return true;
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Avatar URL phải là link ảnh hợp lệ (jpg, jpeg, png, gif, webp)'
    }
  },
  status: {
    type: Boolean,
    default: false
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  loginCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
