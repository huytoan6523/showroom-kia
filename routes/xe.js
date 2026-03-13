const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const xeController = require('../controllers/xeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     PhienBan:
 *       type: object
 *       properties:
 *         ten_phien_ban:
 *           type: string
 *           example: "KIA Morning 1.25 MT"
 *         gia:
 *           type: number
 *           example: 399000000
 *     MauXe:
 *       type: object
 *       properties:
 *         ten_mau:
 *           type: string
 *           example: "Trắng Tuyết"
 *         ma_hex:
 *           type: string
 *           example: "#FFFFFF"
 *         anh_mau:
 *           type: string
 *           example: "https://example.com/mau-trang.jpg"
 *     XeInput:
 *       type: object
 *       required:
 *         - ten_xe
 *         - loai_xe
 *       properties:
 *         ten_xe:
 *           type: string
 *           example: "KIA Morning"
 *         loai_xe:
 *           type: string
 *           example: "Sedan"
 *         nam_san_xuat:
 *           type: integer
 *           example: 2024
 *         mo_ta:
 *           type: string
 *           example: "Xe đô thị cỡ nhỏ, tiết kiệm nhiên liệu"
 *         dong_co:
 *           type: string
 *           example: "1.25L MPI"
 *         hop_so:
 *           type: string
 *           example: "Số sàn 5 cấp"
 *         nhien_lieu:
 *           type: string
 *           example: "Xăng"
 *         so_cho_ngoi:
 *           type: integer
 *           example: 5
 *         muc_tieu_thu:
 *           type: string
 *           example: "5.3L/100km"
 *         kich_thuoc:
 *           type: string
 *           example: "3595 x 1595 x 1490 mm"
 *         anh_dai_dien:
 *           type: string
 *           example: "https://example.com/kia-morning.jpg"
 *         noi_bat:
 *           type: boolean
 *           example: true
 *         phien_ban:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PhienBan'
 *         mau_xe:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MauXe'
 */

// Public routes

/**
 * @swagger
 * /api/xe:
 *   get:
 *     summary: Lấy danh sách tất cả xe
 *     tags: [Xe]
 *     responses:
 *       200:
 *         description: Danh sách xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/XeInput'
 */
router.get('/', xeController.getAll);

/**
 * @swagger
 * /api/xe/noi-bat:
 *   get:
 *     summary: Lấy danh sách xe nổi bật
 *     tags: [Xe]
 *     responses:
 *       200:
 *         description: Danh sách xe nổi bật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/XeInput'
 */
router.get('/noi-bat', xeController.getNoiBat);

/**
 * @swagger
 * /api/xe/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một xe theo ID
 *     tags: [Xe]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của xe
 *     responses:
 *       200:
 *         description: Thông tin xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/XeInput'
 *       404:
 *         description: Không tìm thấy xe
 */
router.get('/:id', xeController.getById);

// Admin routes

/**
 * @swagger
 * /api/xe:
 *   post:
 *     summary: Thêm xe mới
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/XeInput'
 *     responses:
 *       201:
 *         description: Thêm xe thành công
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', auth, xeController.create);

/**
 * @swagger
 * /api/xe/{id}:
 *   put:
 *     summary: Cập nhật thông tin xe
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của xe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/XeInput'
 *     responses:
 *       200:
 *         description: Cập nhật xe thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 */
router.put('/:id', auth, xeController.update);

/**
 * @swagger
 * /api/xe/{id}:
 *   delete:
 *     summary: Xóa xe
 *     tags: [Xe]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của xe
 *     responses:
 *       200:
 *         description: Xóa xe thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 */
router.delete('/:id', auth, xeController.remove);

router.post('/:xe_id/phien-ban', auth, xeController.createPhienBan);
router.put('/:xe_id/phien-ban/:id', auth, xeController.updatePhienBan);
router.delete('/:xe_id/phien-ban/:id', auth, xeController.deletePhienBan);

module.exports = router;
