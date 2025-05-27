require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./src/config/db");
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');


// Initialize express app
const app = express();
// Middleware to parse JSON
app.use(express.json());


// Auth routes
app.use('/api', authRoutes);

//user Routes
app.use("/api/users", taskRoutes);
// Connect to MongoDB
connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

