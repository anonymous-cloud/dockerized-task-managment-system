require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/db");
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const rateLimit = require("express-rate-limit");


// Initialize express app
const app = express();
// Middleware to parse JSON
app.use(express.json());


// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, //  1 minute
  max: 10, // can send 10 requests per windowMs
  message: {
    error: "Too many requests, please try again after a minute."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter); // This will apply rate limiter to all routes




// Auth routes
app.use('/api', authRoutes);

//user Routes
app.use("/api/users", taskRoutes);
// Connect to MongoDB
connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

