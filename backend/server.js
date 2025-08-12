require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000', 
    'https://todo-list-website-fvk3drpit-dhairya-solankis-projects.vercel.app', // Your Vercel domain
    /\.vercel\.app$/  // Allow all vercel.app subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require("./routes/Tasks");
const adminRoutes = require('./routes/admin');

// ✅ Connect to MongoDB
console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI ? "URI provided" : "URI missing");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  console.error("❌ Check your MONGODB_URI environment variable");
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use("/api/tasks", taskRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.json({
    message: "🚀 Todo List API Server is running!",
    status: "Active",
    endpoints: {
      auth: "/api/auth (register, login)",
      tasks: "/api/tasks",
      admin: "/api/admin"
    }
  });
});

// ✅ Catch-all for undefined routes
app.get('*', (req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableEndpoints: ["/api/auth", "/api/tasks", "/api/admin"]
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
