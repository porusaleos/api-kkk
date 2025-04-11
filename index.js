const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Ganti dengan nama database kamu
const mongoUrl = 'mongodb://localhost:27017/tokogitar1';

// Koneksi MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Berhasil Connect Ke Database');
}).catch((e) => {
  console.log('❌ Gagal Connect Ke Database');
  console.log(e);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder static untuk gambar (akses via http://ip:5001/<namafile>)
const directory = path.join(__dirname, '/static/');
app.use(express.static(directory));

// Routes
app.use('/user', require('./routes/user'));
app.use('/gitar', require('./routes/gitar'));
app.use('/transaksi', require('./routes/transaksi'));

// Start server di semua IP LAN (0.0.0.0)
app.listen(5001, '0.0.0.0', () => {
  console.log('🚀 Server Berjalan di http://192.168.x.x:5001');
});
