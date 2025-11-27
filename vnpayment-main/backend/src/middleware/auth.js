const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserStore = require("../models/UserStore");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function authenticate(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing token" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = UserStore.getUserById(payload.id);
    if (!user) return res.status(401).json({ error: "user not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "not authenticated" });
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "admin only" });
  next();
}

module.exports = { authenticate, requireAdmin };
