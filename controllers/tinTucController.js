const { TinTuc } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await TinTuc.findAll({ order: [['created_at', 'DESC']] });
    res.json({ message: 'Lấy danh sách tin tức thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TinTuc.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: 'Không tìm thấy tin tức' });
    res.json({ message: 'Lấy tin tức thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { tieu_de, tom_tat, noi_dung, anh_dai_dien, danh_muc, noi_bat } = req.body;
    const data = await TinTuc.create({ tieu_de, tom_tat, noi_dung, anh_dai_dien, danh_muc: danh_muc || null, noi_bat: noi_bat || false });
    res.status(201).json({ message: 'Tạo tin tức thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const tinTuc = await TinTuc.findByPk(req.params.id);
    if (!tinTuc) return res.status(404).json({ message: 'Không tìm thấy tin tức' });

    const { tieu_de, tom_tat, noi_dung, anh_dai_dien, danh_muc, noi_bat } = req.body;
    await tinTuc.update({ tieu_de, tom_tat, noi_dung, anh_dai_dien, danh_muc: danh_muc || null, noi_bat: noi_bat || false });
    res.json({ message: 'Cập nhật tin tức thành công', data: tinTuc });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const tinTuc = await TinTuc.findByPk(req.params.id);
    if (!tinTuc) return res.status(404).json({ message: 'Không tìm thấy tin tức' });

    await tinTuc.destroy();
    res.json({ message: 'Xóa tin tức thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
