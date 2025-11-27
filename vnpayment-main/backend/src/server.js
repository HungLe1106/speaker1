const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Database connection
const { connectDB } = require("./config/database");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");
const webhookRoutes = require("./routes/webhooks");
const authRoutes = require("./routes/auth");

// Admin routes
const adminProductRoutes = require("./routes/admin/products");
const adminOrderRoutes = require("./routes/admin/orders");
const adminDashboardRoutes = require("./routes/admin/dashboard");
const adminUploadRoutes = require("./routes/admin/upload");

const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ChatService = require("./services/ChatService");
const chatRoutes = require("./routes/chat");

const PORT = process.env.PORT || 5000;
const FALLBACK_PORTS = [5000, 5001, 5002, 5003];

// Security middleware - configure helmet to allow inline styles for admin panel
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration - allow all origins for now
app.use(cors({
  origin: true,  // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID']
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// Admin panel routes - serve HTML files
app.get("/admin", (req, res) => {
  res.redirect("/admin/login.html");
});

app.get("/admin/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "login.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin", "dashboard.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

// Admin routes (protected by adminAuth middleware inside each route file)
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/upload", adminUploadRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Create HTTP server and attach Socket.IO for real-time chat
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,  // Allow all origins
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (roomId = "global") => {
    socket.join(roomId);
    const history = ChatService.getHistory(roomId);
    socket.emit("history", history);
  });

  socket.on("message", async ({ roomId = "global", sender, text }) => {
    const msg = {
      id: Date.now().toString(),
      sender: sender || "Guest",
      text,
      ts: new Date().toISOString(),
    };

    // Add message and await bot response if any
    let botResponse = null;
    try {
      botResponse = await ChatService.addMessage(roomId, msg);
    } catch (err) {
      console.error("ChatService.addMessage error:", err);
    }

    // Emit user message
    io.to(roomId).emit("message", msg);

    // Emit bot response if generated
    if (botResponse && botResponse.isBot) {
      // Small delay to make it feel more natural
      setTimeout(() => {
        io.to(roomId).emit("message", botResponse);
      }, 1000);
    }
  });

  socket.on("typing", ({ roomId = "global", sender }) => {
    socket.to(roomId).emit("typing", { sender });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Robust listen: try next ports if EADDRINUSE to avoid crashing nodemon immediately
function tryListen(port, attempts = 0, maxAttempts = 5) {
  server
    .listen(port)
    .on("listening", () => {
      console.log(`🚀 Server (with Socket.IO) running on port ${port}`);
      console.log(`📄 Health check: http://localhost:${port}/health`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE" && attempts < maxAttempts) {
        const nextPort = port + 1;
        console.warn(`Port ${port} in use, trying ${nextPort}...`);
        // Small delay before retrying
        setTimeout(() => tryListen(nextPort, attempts + 1, maxAttempts), 200);
      } else {
        console.error("Failed to start server:", err);
        // Let nodemon catch and restart if desired
        process.exit(1);
      }
    });
}

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Database connected, starting server...\n');
    
    // Start server
    tryListen(PORT);
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
