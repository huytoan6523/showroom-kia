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

// [NEW] API Tạo tài khoản Admin trực tiếp từ trang đăng nhập (Theo yêu cầu)
router.post('/register', authController.register);

// [DIAGNOSTIC] Kiểm tra kết nối DB và đọc sạch ghi
router.get('/ping-db', async (req, res) => {
  try {
    const { Admin } = require('../models');
    const count = await Admin.count();
    res.json({ ok: true, admin_count: count, message: 'DB kết nối tốt!' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Lỗi query DB: ' + err.message });
  }
});

module.exports = router;
