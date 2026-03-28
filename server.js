process.env.UV_THREADPOOL_SIZE = 1;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// [HEALTH-CHECK] Đặc trị lỗi cPanel "Content type" mismatch
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html'); // Ép đúng định dạng cPanel mong đợi
  res.send('Showroom KIA API is active');
});

// [DIAGNOSTIC] Kiểm tra nhanh
app.get('/test', (req, res) => {
  res.send('🚀 SERVER ĐÃ NHẬN CODE MỚI NHẤT 16:09!');
});
app.get('/api/ping', (req, res) => res.json({ status: 'ok', msg: 'Pong!' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/xe', require('./routes/xe'));
app.use('/api/tin-tuc', require('./routes/tinTuc'));
app.use('/api/dat-lich', require('./routes/datLich'));
app.use('/api/cai-dat', require('./routes/caiDat'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/anh-slide', require('./routes/anhSlide'));

const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

// [OPTIMIZE] Trì hoãn việc sync Database để Server khởi động nhanh nhất có thể
setTimeout(() => {
  sequelize.sync()
    .then(async () => {
      console.log('✅ Database đã được kết nối ở chế độ nền!');
    })
    .catch(err => console.log('❌ Lỗi kết nối DB sau khởi động:', err.message));
}, 5000);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server KIA đã sẵn sàng và đang chạy!`);
});