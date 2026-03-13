const { Xe, PhienBan, MauXe, AnhXe } = require('../models');

const includeAll = [
  { model: PhienBan },
  { model: MauXe },
  { model: AnhXe },
];

exports.getAll = async (req, res) => {
  try {
    const data = await Xe.findAll({ include: includeAll });
    res.json({ message: 'Lấy danh sách xe thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getNoiBat = async (req, res) => {
  try {
    const data = await Xe.findAll({ where: { noi_bat: true }, include: includeAll });
    res.json({ message: 'Lấy xe nổi bật thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Xe.findByPk(req.params.id, { include: includeAll });
    if (!data) return res.status(404).json({ message: 'Không tìm thấy xe' });
    res.json({ message: 'Lấy thông tin xe thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { phien_ban, mau_xe, ...xeData } = req.body;

    const xe = await Xe.create(xeData);

    if (Array.isArray(phien_ban) && phien_ban.length > 0) {
      const rows = phien_ban.map((pb) => ({ ...pb, xe_id: xe.id }));
      await PhienBan.bulkCreate(rows);
    }

    if (Array.isArray(mau_xe) && mau_xe.length > 0) {
      const rows = mau_xe.map((mx) => ({ ...mx, xe_id: xe.id }));
      await MauXe.bulkCreate(rows);
    }

    const data = await Xe.findByPk(xe.id, { include: includeAll });
    res.status(201).json({ message: 'Tạo xe thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const xe = await Xe.findByPk(req.params.id);
    if (!xe) return res.status(404).json({ message: 'Không tìm thấy xe' });

    const { phien_ban, mau_xe, ...xeData } = req.body;

    await xe.update(xeData);

    if (Array.isArray(phien_ban)) {
      await PhienBan.destroy({ where: { xe_id: xe.id } });
      if (phien_ban.length > 0) {
        await PhienBan.bulkCreate(phien_ban.map((pb) => ({ ...pb, xe_id: xe.id })));
      }
    }

    if (Array.isArray(mau_xe)) {
      await MauXe.destroy({ where: { xe_id: xe.id } });
      if (mau_xe.length > 0) {
        await MauXe.bulkCreate(mau_xe.map((mx) => ({ ...mx, xe_id: xe.id })));
      }
    }

    const data = await Xe.findByPk(xe.id, { include: includeAll });
    res.json({ message: 'Cập nhật xe thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const xe = await Xe.findByPk(req.params.id);
    if (!xe) return res.status(404).json({ message: 'Không tìm thấy xe' });

    await xe.destroy();
    res.json({ message: 'Xóa xe thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.createPhienBan = async (req, res) => {
  try {
    const xe = await Xe.findByPk(req.params.xe_id);
    if (!xe) return res.status(404).json({ message: 'Không tìm thấy xe' });

    const { ten_phien_ban, gia } = req.body;
    const data = await PhienBan.create({ xe_id: xe.id, ten_phien_ban, gia });
    res.status(201).json({ message: 'Thêm phiên bản thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.updatePhienBan = async (req, res) => {
  try {
    const pb = await PhienBan.findOne({ where: { id: req.params.id, xe_id: req.params.xe_id } });
    if (!pb) return res.status(404).json({ message: 'Không tìm thấy phiên bản' });

    const { ten_phien_ban, gia } = req.body;
    await pb.update({ ten_phien_ban, gia });
    res.json({ message: 'Cập nhật phiên bản thành công', data: pb });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.deletePhienBan = async (req, res) => {
  try {
    const pb = await PhienBan.findOne({ where: { id: req.params.id, xe_id: req.params.xe_id } });
    if (!pb) return res.status(404).json({ message: 'Không tìm thấy phiên bản' });

    await pb.destroy();
    res.json({ message: 'Xóa phiên bản thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
