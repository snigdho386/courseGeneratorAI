// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Essential for receiving AI JSON data

// Basic Test Route
app.get('/status', (req, res) => {
    res.json({ message: "Text-to-Learn API is live!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});