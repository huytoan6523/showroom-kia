const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { Xe, AnhXe, MauXe, TinTuc } = require('../models');

// Ensure upload directories exist on startup
['xe', 'mau', 'tin-tuc', 'editor'].forEach((folder) => {
  fs.mkdirSync(path.join(__dirname, '..', 'public', 'images', folder), { recursive: true });
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpg|jpeg|png|webp)$/i;
  const allowedMime = /^image\/(jpeg|png|webp)$/;
  if (allowedExt.test(file.originalname) && allowedMime.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)'));
  }
};

const limits = { fileSize: 5 * 1024 * 1024 };

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', 'public', 'images', folder));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname).toLowerCase());
    },
  });

const uploadAnhXeMulti = multer({ storage: makeStorage('xe'), fileFilter, limits }).array('images', 10);
const uploadAnhXeSingle = multer({ storage: makeStorage('xe'), fileFilter, limits }).single('image');
const uploadAnhMau = multer({ storage: makeStorage('mau'), fileFilter, limits }).single('image');
const uploadAnhTinTuc = multer({ storage: makeStorage('tin-tuc'), fileFilter, limits }).single('image');
const uploadEditor = multer({ storage: makeStorage('editor'), fileFilter, limits }).single('file');

exports.anhXe = (req, res) => {
  uploadAnhXeMulti(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'Không có file nào được upload' });

    try {
      const { xe_id } = req.params;
      const xe = await Xe.findByPk(xe_id);
      if (!xe) return res.status(404).json({ message: 'Không tìm thấy xe' });

      const rows = req.files.map((file, index) => ({
        xe_id: parseInt(xe_id),
        url_anh: `/images/xe/${file.filename}`,
        thu_tu: index,
      }));
      const data = await AnhXe.bulkCreate(rows);
      res.status(201).json({ message: 'Upload ảnh xe thành công', data });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });
};

exports.anhDaiDien = (req, res) => {
  uploadAnhXeSingle(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: 'Không có file nào được upload' });

    try {
      const { xe_id } = req.params;
      const xe = await Xe.findByPk(xe_id);
      if (!xe) return res.status(404).json({ message: 'Không tìm thấy xe' });

      await xe.update({ anh_dai_dien: `/images/xe/${req.file.filename}` });
      res.json({ message: 'Upload ảnh đại diện thành công', data: xe });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });
};

exports.anhMau = (req, res) => {
  uploadAnhMau(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: 'Không có file nào được upload' });

    try {
      const { mau_id } = req.params;
      const mauXe = await MauXe.findByPk(mau_id);
      if (!mauXe) return res.status(404).json({ message: 'Không tìm thấy màu xe' });

      await mauXe.update({ anh_mau: `/images/mau/${req.file.filename}` });
      res.json({ message: 'Upload ảnh màu thành công', data: mauXe });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });
};

exports.anhTinTuc = (req, res) => {
  uploadAnhTinTuc(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: 'Không có file nào được upload' });

    try {
      const { tin_tuc_id } = req.params;
      const tinTuc = await TinTuc.findByPk(tin_tuc_id);
      if (!tinTuc) return res.status(404).json({ message: 'Không tìm thấy tin tức' });

      await tinTuc.update({ anh_dai_dien: `/images/tin-tuc/${req.file.filename}` });
      res.json({ message: 'Upload ảnh tin tức thành công', data: tinTuc });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });
};

exports.deleteAnhXe = async (req, res) => {
  try {
    const anh = await AnhXe.findByPk(req.params.anh_id);
    if (!anh) return res.status(404).json({ message: 'Không tìm thấy ảnh' });

    const filePath = path.join(__dirname, '..', 'public', anh.url_anh);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await anh.destroy();
    res.json({ message: 'Xóa ảnh thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.editor = (req, res) => {
  uploadEditor(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file)
      return res.status(400).json({ message: 'Không có file nào được upload' });

    res.json({ location: `/images/editor/${req.file.filename}` });
  });
};
