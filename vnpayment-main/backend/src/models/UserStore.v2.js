const User = require('./UserModel');

/**
 * Create new user
 */
async function createUser(username, password, role = 'user') {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Generate salt and hash password
    const salt = User.generateSalt();
    const hash = User.hashPassword(password, salt);

    // Create user
    const user = new User({
      username,
      salt,
      hash,
      role,
      status: 'active'
    });

    await user.save();

    // Return user without sensitive data
    return {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Verify user credentials
 */
async function verifyUser(username, password) {
  try {
    const user = await User.findOne({ username, status: 'active' });
    if (!user) {
      return null;
    }

    // Verify password
    const isValid = user.verifyPassword(password);
    if (!isValid) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      profile: user.profile
    };
  } catch (error) {
    console.error('verifyUser error:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
async function getUserById(id) {
  try {
    const user = await User.findById(id).select('-salt -hash');
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      status: user.status,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error('getUserById error:', error);
    return null;
  }
}

/**
 * Get user by username
 */
async function getUserByUsername(username) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      salt: user.salt,
      hash: user.hash,
      profile: user.profile,
      status: user.status
    };
  } catch (error) {
    console.error('getUserByUsername error:', error);
    return null;
  }
}

/**
 * Update user profile
 */
async function updateProfile(userId, profileData) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update profile fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined) {
        if (key === 'address' && typeof profileData[key] === 'object') {
          user.profile.address = {
            ...user.profile.address,
            ...profileData[key]
          };
        } else {
          user.profile[key] = profileData[key];
        }
      }
    });

    await user.save();

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Change password
 */
async function changePassword(userId, oldPassword, newPassword) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify old password
    const isValid = user.verifyPassword(oldPassword);
    if (!isValid) {
      return { success: false, error: 'Wrong password' };
    }

    // Generate new salt and hash
    const newSalt = User.generateSalt();
    const newHash = User.hashPassword(newPassword, newSalt);

    user.salt = newSalt;
    user.hash = newHash;
    await user.save();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all users (admin only)
 */
async function readUsers(filters = {}) {
  try {
    const query = {};
    
    if (filters.role) {
      query.role = filters.role;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }

    const users = await User.find(query)
      .select('-salt -hash')
      .sort({ createdAt: -1 });

    return users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      profile: user.profile,
      createdAt: user.createdAt
    }));
  } catch (error) {
    console.error('readUsers error:', error);
    return [];
  }
}

/**
 * Update user status (admin only)
 */
async function updateUserStatus(userId, status) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.status = status;
    await user.save();

    return {
      id: user._id,
      username: user.username,
      status: user.status
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Ensure default admin accounts exist
 */
async function ensureDefaultAccounts() {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('📝 Creating default accounts...');
      
      // Create admin account
      await createUser('admin', 'adminpass', 'admin');
      console.log('✅ Admin account created (username: admin, password: adminpass)');
      
      // Create user account
      await createUser('user', 'userpass', 'user');
      console.log('✅ User account created (username: user, password: userpass)');
    }
  } catch (error) {
    console.error('❌ Error creating default accounts:', error.message);
  }
}

/**
 * Get user statistics (admin only)
 */
async function getUserStats() {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // Get recently registered users
    const recentUsers = await User.find()
      .select('username email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      byRole: {
        admin: adminUsers,
        user: regularUsers
      },
      recentUsers: recentUsers.map(u => ({
        id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    };
  } catch (error) {
    console.error('getUserStats error:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      byRole: { admin: 0, user: 0 },
      recentUsers: []
    };
  }
}

module.exports = {
  createUser,
  verifyUser,
  getUserById,
  getUserByUsername,
  updateProfile,
  changePassword,
  readUsers,
  updateUserStatus,
  ensureDefaultAccounts,
  getUserStats
};
