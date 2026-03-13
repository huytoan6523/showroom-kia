const { DatLich } = require('../models');

exports.create = async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, email, xe_quan_tam, ngay_hen, ghi_chu } = req.body;
    const data = await DatLich.create({ ho_ten, so_dien_thoai, email, xe_quan_tam, ngay_hen, ghi_chu });
    res.status(201).json({ message: 'Đặt lịch thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await DatLich.findAll({ order: [['created_at', 'DESC']] });
    res.json({ message: 'Lấy danh sách đặt lịch thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await DatLich.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Không tìm thấy đặt lịch' });
    res.json({ message: 'Lấy đặt lịch thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updateTrangThai = async (req, res) => {
  try {
    const datLich = await DatLich.findByPk(req.params.id);
    if (!datLich) return res.status(404).json({ message: 'Không tìm thấy đặt lịch' });

    const { trang_thai } = req.body;
    const allowedValues = ['Chờ xử lý', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'];
    if (!allowedValues.includes(trang_thai)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }
    await datLich.update({ trang_thai });
    res.json({ message: 'Cập nhật trạng thái thành công', data: datLich });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const datLich = await DatLich.findByPk(req.params.id);
    if (!datLich) return res.status(404).json({ message: 'Không tìm thấy đặt lịch' });

    await datLich.destroy();
    res.json({ message: 'Xóa đặt lịch thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
