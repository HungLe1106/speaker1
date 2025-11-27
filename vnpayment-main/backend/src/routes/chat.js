const express = require("express");
const router = express.Router();
const ChatService = require("../services/ChatService");

// GET /api/chat/history/:roomId?
router.get("/history/:roomId?", (req, res) => {
  const roomId = req.params.roomId || "global";
  const history = ChatService.getHistory(roomId);
  res.json({ roomId, messages: history });
});

module.exports = router;
