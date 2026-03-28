const express = require('express');
const cors = require('cors');
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

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Database đã sync xong!'))
  .catch(err => console.log('❌ Lỗi sync:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});