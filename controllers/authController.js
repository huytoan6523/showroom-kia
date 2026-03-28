const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// Đăng ký tài khoản Admin (từ giao diện đăng nhập)
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Thiếu tên đăng nhập hoặc mật khẩu!' });

    const existing = await Admin.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Tên đăng nhập này đã tồn tại!' });

    const hashedPassword = await bcrypt.hash(password, 4);
    await Admin.create({ username, password: hashedPassword });

    res.json({ message: 'Tạo tài khoản thành công! Bây giờ bạn có thể ấn Đăng nhập.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tạo!', error: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Khôi phục lại bước kiểm tra bảo mật để đảm bảo hệ thống an toàn chặn người lạ
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'fallback_secret_key_kia',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      admin: { id: admin.id, username: admin.username }
    });

  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};

// Đổi mật khẩu
exports.doiMatKhau = async (req, res) => {
  try {
    const { matKhauCu, matKhauMoi } = req.body;

    const admin = await Admin.findByPk(req.admin.id);
    const isMatch = await bcrypt.compare(matKhauCu, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng!' });
    }

    const hashedPassword = await bcrypt.hash(matKhauMoi, 4);
    await admin.update({ password: hashedPassword });

    res.json({ message: 'Đổi mật khẩu thành công!' });

  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};