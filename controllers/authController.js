const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra username
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
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

    const hashedPassword = await bcrypt.hash(matKhauMoi, 10);
    await admin.update({ password: hashedPassword });

    res.json({ message: 'Đổi mật khẩu thành công!' });

  } catch (err) {
    res.status(500).json({ message: 'Lỗi server!', error: err.message });
  }
};