const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const auth = require('../middleware/auth');
const { AnhSlide } = require('../models');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/images/slide');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, webp)'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/anh-slide — public, no auth
router.get('/', async (req, res) => {
  try {
    const { vi_tri, all } = req.query; // all=true để lấy cả ảnh đang bị ẩn (dùng cho admin)
    const where = {};
    if (vi_tri) where.vi_tri = vi_tri;
    if (all !== 'true') where.hien_thi = true;

    const data = await AnhSlide.findAll({ 
      where,
      order: [['thu_tu', 'ASC'], ['created_at', 'ASC']] 
    });
    res.json({ message: 'Lấy danh sách ảnh slide thành công', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// POST /api/anh-slide/upload — auth required, multiple files
router.post('/upload', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng chọn ít nhất một ảnh' });
    }
    const { vi_tri, thu_tu } = req.body;
    
    const records = await Promise.all(
      req.files.map((file, idx) =>
        AnhSlide.create({
          url_anh: '/images/slide/' + file.filename,
          vi_tri: vi_tri || 'khach_hang',
          thu_tu: Number(thu_tu) || idx,
          hien_thi: true
        })
      )
    );
    res.status(201).json({ message: 'Tải ảnh lên thành công', data: records });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// PUT /api/anh-slide/:id — auth required, update metadata
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await AnhSlide.findByPk(id);
    if (!slide) return res.status(404).json({ message: 'Không tìm thấy ảnh slide' });

    const { thu_tu, hien_thi, vi_tri } = req.body;
    
    // Tạo đối tượng cập nhật
    const updateData = {};
    if (thu_tu !== undefined) updateData.thu_tu = Number(thu_tu);
    if (vi_tri !== undefined) updateData.vi_tri = vi_tri;
    
    // Xử lý hien_thi một cách tuyệt đối (ép về 0 hoặc 1)
    if (hien_thi !== undefined) {
        updateData.hien_thi = (hien_thi === true || hien_thi === 'true' || hien_thi === 1);
    }

    await AnhSlide.update(updateData, { where: { id: id } });
    
    const updated = await AnhSlide.findByPk(id);
    return res.json({ message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    console.error('❌ Lỗi PUT /api/anh-slide:', error.message);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// DELETE /api/anh-slide/:id — auth required
router.delete('/:id', auth, async (req, res) => {
  try {
    const slide = await AnhSlide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Không tìm thấy ảnh slide' });

    // Remove file from disk
    const filePath = path.join(__dirname, '../public', slide.url_anh);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await slide.destroy();
    res.json({ message: 'Xóa ảnh slide thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;
