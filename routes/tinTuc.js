const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tinTucController = require('../controllers/tinTucController');

/**
 * @swagger
 * components:
 *   schemas:
 *     TinTuc:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         tieu_de:
 *           type: string
 *           example: "KIA ra mắt Sportage 2025"
 *         tom_tat:
 *           type: string
 *           example: "Mô tả ngắn về bài viết..."
 *         noi_dung:
 *           type: string
 *           example: "Nội dung đầy đủ của bài viết..."
 *         anh_dai_dien:
 *           type: string
 *           example: "https://example.com/sportage-2025.jpg"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T08:30:00.000Z"
 *     TinTucInput:
 *       type: object
 *       required:
 *         - tieu_de
 *       properties:
 *         tieu_de:
 *           type: string
 *           example: "KIA ra mắt Sportage 2025"
 *         tom_tat:
 *           type: string
 *           example: "Mô tả ngắn về bài viết..."
 *         noi_dung:
 *           type: string
 *           example: "Nội dung đầy đủ của bài viết..."
 *         anh_dai_dien:
 *           type: string
 *           example: "https://example.com/sportage-2025.jpg"
 */

/**
 * @swagger
 * /api/tin-tuc:
 *   get:
 *     summary: Lấy danh sách tất cả tin tức
 *     tags: [Tin tức]
 *     responses:
 *       200:
 *         description: Danh sách tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách tin tức thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TinTuc'
 */
router.get('/', tinTucController.getAll);

/**
 * @swagger
 * /api/tin-tuc/{id}:
 *   get:
 *     summary: Lấy chi tiết một tin tức theo ID
 *     tags: [Tin tức]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của tin tức
 *     responses:
 *       200:
 *         description: Lấy tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy tin tức thành công"
 *                 data:
 *                   $ref: '#/components/schemas/TinTuc'
 *       404:
 *         description: Không tìm thấy tin tức
 */
router.get('/:id', tinTucController.getById);
router.get('/slug/:slug', tinTucController.getBySlug);

/**
 * @swagger
 * /api/tin-tuc:
 *   post:
 *     summary: Tạo tin tức mới
 *     tags: [Tin tức]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TinTucInput'
 *     responses:
 *       201:
 *         description: Tạo tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo tin tức thành công"
 *                 data:
 *                   $ref: '#/components/schemas/TinTuc'
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', auth, tinTucController.create);

/**
 * @swagger
 * /api/tin-tuc/{id}:
 *   put:
 *     summary: Cập nhật tin tức
 *     tags: [Tin tức]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của tin tức
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TinTucInput'
 *     responses:
 *       200:
 *         description: Cập nhật tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật tin tức thành công"
 *                 data:
 *                   $ref: '#/components/schemas/TinTuc'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tin tức
 */
router.put('/:id', auth, tinTucController.update);

/**
 * @swagger
 * /api/tin-tuc/{id}:
 *   delete:
 *     summary: Xóa tin tức
 *     tags: [Tin tức]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của tin tức
 *     responses:
 *       200:
 *         description: Xóa tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa tin tức thành công"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tin tức
 */
router.delete('/:id', auth, tinTucController.remove);

module.exports = router;
