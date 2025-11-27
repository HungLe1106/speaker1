import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./ChatWidget.css";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function ChatWidget({
  roomId = "global",
  user = { name: "Guest" },
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", roomId);
    });

    socket.on("history", (hist) => {
      setMessages(hist || []);
    });

    socket.on("message", (msg) => {
      setMessages((s) => [...s, msg]);
    });

    socket.on("typing", ({ sender }) => {
      setTyping(sender);
      setTimeout(() => setTyping(null), 1500);
    });

    socket.on("disconnect", () => {});

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = () => {
    if (!text.trim()) return;

    if (!socketRef.current?.connected) {
      socketRef.current?.connect();
      return;
    }

    const payload = { roomId, sender: user.name || "Guest", text: text.trim() };
    socketRef.current.emit("message", payload);
    setText("");
  };

  return (
    <div className="chat-widget">
      <div>
        <button className="chat-toggle" onClick={() => setOpen((v) => !v)}>
          {open ? "Đóng chat" : "Chat với shop"}
        </button>
      </div>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">Chat với shop</div>
          <div className="chat-body">
            {messages.map((m) => (
              <div
                key={m.id || `${m.sender}-${m.ts}`}
                className={`message ${
                  m.sender === "ShopBot" || m.sender === "Shop" ? "bot" : ""
                }`}
              >
                <div className="meta">
                  {m.sender}  {new Date(m.ts).toLocaleTimeString()}
                </div>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="chat-footer">
            {typing && (
              <div className="typing-indicator">{typing} đang gõ...</div>
            )}
            <div className="chat-input-row">
              <input
                className="chat-input"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  socketRef.current?.emit("typing", {
                    roomId,
                    sender: user.name,
                  });
                }}
              />
              <button className="chat-send" onClick={send}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
