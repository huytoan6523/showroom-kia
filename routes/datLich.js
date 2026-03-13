const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const datLichController = require('../controllers/datLichController');

/**
 * @swagger
 * components:
 *   schemas:
 *     DatLich:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ho_ten:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         so_dien_thoai:
 *           type: string
 *           example: "0909123456"
 *         email:
 *           type: string
 *           example: "a@gmail.com"
 *         xe_quan_tam:
 *           type: string
 *           example: "KIA Sportage"
 *         ngay_hen:
 *           type: string
 *           format: date-time
 *           example: "2024-02-01T09:00:00"
 *         ghi_chu:
 *           type: string
 *           example: "Muốn lái thử"
 *         trang_thai:
 *           type: string
 *           enum: [Chờ xử lý, Đã xác nhận, Đã hủy]
 *           example: "Chờ xử lý"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T08:30:00.000Z"
 *     DatLichInput:
 *       type: object
 *       required:
 *         - ho_ten
 *         - so_dien_thoai
 *       properties:
 *         ho_ten:
 *           type: string
 *           example: "Nguyễn Văn A"
 *         so_dien_thoai:
 *           type: string
 *           example: "0909123456"
 *         email:
 *           type: string
 *           example: "a@gmail.com"
 *         xe_quan_tam:
 *           type: string
 *           example: "KIA Sportage"
 *         ngay_hen:
 *           type: string
 *           format: date-time
 *           example: "2024-02-01T09:00:00"
 *         ghi_chu:
 *           type: string
 *           example: "Muốn lái thử"
 */

/**
 * @swagger
 * /api/dat-lich:
 *   post:
 *     summary: Khách hàng đặt lịch xem xe
 *     tags: [Đặt lịch]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DatLichInput'
 *     responses:
 *       201:
 *         description: Đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đặt lịch thành công"
 *                 data:
 *                   $ref: '#/components/schemas/DatLich'
 */
router.post('/', datLichController.create);

/**
 * @swagger
 * /api/dat-lich:
 *   get:
 *     summary: Lấy danh sách tất cả đặt lịch
 *     tags: [Đặt lịch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách đặt lịch thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DatLich'
 *       401:
 *         description: Không có quyền truy cập
 */
router.get('/', auth, datLichController.getAll);

/**
 * @swagger
 * /api/dat-lich/{id}:
 *   get:
 *     summary: Lấy chi tiết một đặt lịch theo ID
 *     tags: [Đặt lịch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của đặt lịch
 *     responses:
 *       200:
 *         description: Lấy đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy đặt lịch thành công"
 *                 data:
 *                   $ref: '#/components/schemas/DatLich'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đặt lịch
 */
router.get('/:id', auth, datLichController.getById);

/**
 * @swagger
 * /api/dat-lich/{id}/trang-thai:
 *   put:
 *     summary: Cập nhật trạng thái đặt lịch
 *     tags: [Đặt lịch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của đặt lịch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trang_thai
 *             properties:
 *               trang_thai:
 *                 type: string
 *                 enum: [Chờ xử lý, Đã xác nhận, Đã hủy]
 *                 example: "Đã xác nhận"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái thành công"
 *                 data:
 *                   $ref: '#/components/schemas/DatLich'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đặt lịch
 */
router.put('/:id/trang-thai', auth, datLichController.updateTrangThai);

/**
 * @swagger
 * /api/dat-lich/{id}:
 *   delete:
 *     summary: Xóa đặt lịch
 *     tags: [Đặt lịch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của đặt lịch
 *     responses:
 *       200:
 *         description: Xóa đặt lịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa đặt lịch thành công"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy đặt lịch
 */
router.delete('/:id', auth, datLichController.remove);

module.exports = router;
