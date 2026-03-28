const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Sai tên đăng nhập hoặc mật khẩu
 */
router.post('/login', authController.login);

router.post('/register', authController.register);

// [DIAGNOSTIC] Kiểm tra kết nối DB
router.get('/ping-db', async (req, res) => {
  try {
    const { Admin } = require('../models');
    const count = await Admin.count();
    res.json({ ok: true, admin_count: count, message: 'Kết nối DB tốt!' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Lỗi DB: ' + err.message });
  }
});

// [DEBUG] Xem cấu hình thực tế (Không hiện mật khẩu)
router.get('/debug-config', (req, res) => {
  try {
    const { Admin } = require('../models');
    const config = Admin.sequelize.config;
    res.json({
      database: config.database,
      username: config.username,
      host: config.host,
      port: config.port,
      message: "Đây là cấu hình thực tế mà Server đang chạy!"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [SEED] Nạp dữ liệu mẫu
router.get('/seed', async (req, res) => {
  try {
    const { Admin, Xe } = require('../models');
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('admin123', 4);
    await Admin.findOrCreate({
      where: { username: 'admin' },
      defaults: { username: 'admin', password: hashed, hoTen: 'Admin' }
    });
    await Xe.findOrCreate({
      where: { tenXe: 'KIA Seltos 2024' },
      defaults: { tenXe: 'KIA Seltos 2024', loaiXe: 'SUV', giaBan: 600000000, tinhTrang: 'Sẵn xe' }
    });
    res.json({ ok: true, message: 'Đã nạp dữ liệu mẫu!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi seeding: ' + err.message });
  }
});

/**
 * @swagger
 * /api/auth/doi-mat-khau:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matKhauCu
 *               - matKhauMoi
 *             properties:
 *               matKhauCu:
 *                 type: string
 *                 example: "123456"
 *               matKhauMoi:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc dữ liệu không hợp lệ
 */
router.put('/doi-mat-khau', authMiddleware, authController.doiMatKhau);

module.exports = router;
