const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// [HEALTH-CHECK] Đặc trị lỗi cPanel "Content type" mismatch & Khôi phục giao diện
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// [DIAGNOSTIC] Kiểm tra nhanh
app.get('/test', (req, res) => res.send('🚀 Server KIA đã nhận code mới nhất!'));
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

sequelize.sync()
  .then(async () => {
    console.log('✅ Database đã sync xong!');
    // Tự động kiểm tra admin trong "nền" để không chặn app khởi động
    setImmediate(async () => {
      try {
        const adminCount = await Admin.count();
        if (adminCount === 0) {
          const hashedPassword = await bcrypt.hash('admin123', 4);
          await Admin.create({ username: 'admin', password: hashedPassword });
          console.log('✅ Đã tự động tạo admin mặc định: admin/admin123');
        }
      } catch (e) {
        console.log('❌ Lỗi kiểm tra admin thầm lặng:', e.message);
      }
    });
  })
  .catch(err => console.log('❌ Lỗi sync:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server KIA đã sẵn sàng và đang chạy!`);
});