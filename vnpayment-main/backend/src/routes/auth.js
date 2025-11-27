const express = require("express");
const jwt = require("jsonwebtoken");
const UserStore = require("../models/UserStore.v2"); // ✅ Changed to MongoDB version
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => { // ✅ Added async
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ 
      success: false,
      error: "username and password required" 
    });

  const user = await UserStore.verifyUser(username, password); // ✅ Added await
  if (!user) return res.status(401).json({ 
    success: false,
    error: "invalid credentials" 
  });

  const token = generateToken(user);
  return res.json({ 
    success: true,
    data: {
      token, 
      user
    }
  });
});

// POST /api/auth/register
// Creates a new user with role 'user'
router.post("/register", async (req, res) => { // ✅ Added async
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ 
      success: false,
      error: "username and password required" 
    });
  try {
    const user = await UserStore.createUser(username, password, "user"); // ✅ Added await
    const token = generateToken(user);
    return res.status(201).json({ 
      success: true,
      data: {
        token, 
        user
      }
    });
  } catch (err) {
    return res
      .status(400)
      .json({ 
        success: false,
        error: err.message || "could not create user" 
      });
  }
});

// POST /api/auth/logout
// For stateless JWT, logout is handled client-side by discarding token. Provide endpoint for compatibility.
router.post("/logout", (req, res) => {
  return res.json({ 
    success: true,
    message: "Logged out successfully" 
  });
});

// GET /api/auth/me
router.get("/me", async (req, res) => { // ✅ Added async
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ 
    success: false,
    error: "missing token" 
  });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserStore.getUserById(payload.id); // ✅ Added await
    return res.json({ 
      success: true,
      data: { user }
    });
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      error: "invalid token" 
    });
  }
});

module.exports = router;
