const ShopBot = require("./ShopBot");
const chats = {};

const SHOP_BOT = {
  id: "shop_bot",
  name: "Shop Hỗ Trợ",
};

module.exports = {
  async addMessage(roomId = "global", message) {
    if (!chats[roomId]) chats[roomId] = [];

    // Add user message
    chats[roomId].push(message);

    // Generate bot response if message is from a customer
    if (message.sender !== SHOP_BOT.name) {
      const botResponse = await ShopBot.generateResponse(message.text);
      const botMessage = {
        id: Date.now().toString(),
        sender: SHOP_BOT.name,
        text: botResponse.text,
        ts: new Date().toISOString(),
        isBot: true,
        intent: botResponse.intent,
      };
      chats[roomId].push(botMessage);
    }

    // keep last 200 messages per room to avoid unbounded memory growth
    while (chats[roomId].length > 200) {
      chats[roomId].shift();
    }

    // Return bot message if one was generated
    return message.sender !== SHOP_BOT.name
      ? chats[roomId][chats[roomId].length - 1]
      : null;
  },

  getHistory(roomId = "global") {
    return chats[roomId] || [];
  },

  getBotInfo() {
    return SHOP_BOT;
  },
};
