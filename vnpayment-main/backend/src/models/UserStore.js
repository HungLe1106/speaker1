const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "..", "data");
const usersFile = path.join(dataDir, "users.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readUsers() {
  ensureDataDir();
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]), "utf8");
  }
  const raw = fs.readFileSync(usersFile, "utf8") || "[]";
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  ensureDataDir();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(String(password), salt, 100000, 64, "sha512")
    .toString("hex");
}

function createUser(username, password, role = "user") {
  const users = readUsers();
  if (users.find((u) => u.username === username)) {
    throw new Error("User already exists");
  }
  const id = Date.now().toString();
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  const user = { id, username, role, salt, hash };
  users.push(user);
  writeUsers(users);
  return { id, username, role };
}

function verifyUser(username, password) {
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return null;
  const candidate = hashPassword(password, user.salt);
  if (
    crypto.timingSafeEqual(
      Buffer.from(candidate, "hex"),
      Buffer.from(user.hash, "hex")
    )
  ) {
    return { id: user.id, username: user.username, role: user.role };
  }
  return null;
}

function getUserById(id) {
  const users = readUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return { id: user.id, username: user.username, role: user.role };
}

function getUserByUsername(username) {
  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    salt: user.salt,
    hash: user.hash,
  };
}

// Ensure at least two default accounts exist (admin/user) if none present
function ensureDefaultAccounts() {
  const users = readUsers();
  if (users.length === 0) {
    // default passwords: admin: adminpass, user: userpass
    const adminSalt = crypto.randomBytes(16).toString("hex");
    const adminHash = hashPassword("adminpass", adminSalt);
    const userSalt = crypto.randomBytes(16).toString("hex");
    const userHash = hashPassword("userpass", userSalt);
    users.push({
      id: "1",
      username: "admin",
      role: "admin",
      salt: adminSalt,
      hash: adminHash,
    });
    users.push({
      id: "2",
      username: "user",
      role: "user",
      salt: userSalt,
      hash: userHash,
    });
    writeUsers(users);
  }
}

// Initialize defaults on module load
ensureDefaultAccounts();

module.exports = {
  createUser,
  verifyUser,
  getUserById,
  getUserByUsername,
  readUsers,
  writeUsers,
};
