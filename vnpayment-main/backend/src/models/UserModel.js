const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true, // Allow null but unique if exists
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    fullName: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    avatar: {
      type: String,
      default: null
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    }
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  },
  lastLogin: Date
}, {
  timestamps: true // Tự động tạo createdAt và updatedAt
});

// Indexes are already defined in schema with unique: true
// No need to define them again here

// Static methods
userSchema.statics.hashPassword = function(password, salt) {
  return crypto
    .pbkdf2Sync(String(password), salt, 100000, 64, 'sha512')
    .toString('hex');
};

userSchema.statics.generateSalt = function() {
  return crypto.randomBytes(16).toString('hex');
};

// Instance methods
userSchema.methods.verifyPassword = function(password) {
  const hash = mongoose.model('User').hashPassword(password, this.salt);
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(this.hash, 'hex')
  );
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.salt;
  delete obj.hash;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
