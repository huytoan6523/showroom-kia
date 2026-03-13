const { CaiDat } = require('../models');

exports.get = async (req, res) => {
  try {
    const [data] = await CaiDat.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    res.json({ message: 'Lấy cài đặt thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { ten_cong_ty, dia_chi, so_dien_thoai, email, gio_lam_viec, facebook, zalo, gioi_thieu } = req.body;
    const [caiDat] = await CaiDat.findOrCreate({ where: { id: 1 }, defaults: { id: 1 } });
    await caiDat.update({ ten_cong_ty, dia_chi, so_dien_thoai, email, gio_lam_viec, facebook, zalo, gioi_thieu });
    res.json({ message: 'Cập nhật cài đặt thành công', data: caiDat });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
