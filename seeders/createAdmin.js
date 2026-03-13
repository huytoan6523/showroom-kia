const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword,
    });
    console.log('✅ Tạo tài khoản admin thành công!');
    console.log('Username: admin');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.log('❌ Lỗi:', err.message);
    process.exit(1);
  }
};

createAdmin();