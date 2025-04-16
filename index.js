const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const serverless = require('serverless-http');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env

const app = express();

// MongoDB Connection
const mongoUrl = process.env.MONGODB_URL; // Pastikan variabel ini ada di .env
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ DB Error:', err));

// Middleware
app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Middleware untuk parsing JSON
app.use(express.urlencoded({ extended: true })); // Middleware untuk parsing URL encoded data

// Static folder (optional)
const directory = path.join(__dirname, 'static'); // Sesuaikan dengan lokasi folder static
app.use('/static', express.static(directory)); // Menyajikan file statis

// Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/gitar', require('./routes/gitar'));
app.use('/api/transaksi', require('./routes/transaksi'));

// Export serverless handler (untuk AWS Lambda atau serverless environment)
module.exports = app;
module.exports.handler = serverless(app);
