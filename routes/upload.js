const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

/**
 * @swagger
 * /api/upload/anh-xe/{xe_id}:
 *   post:
 *     summary: Upload nhiều ảnh cho xe (tối đa 10 ảnh)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xe_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của xe
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Các file ảnh (jpg, jpeg, png, webp), tối đa 10 ảnh, mỗi ảnh tối đa 5MB
 *     responses:
 *       201:
 *         description: Upload ảnh xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh xe thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       xe_id:
 *                         type: integer
 *                         example: 1
 *                       url_anh:
 *                         type: string
 *                         example: "/images/xe/1706789123456.jpg"
 *                       thu_tu:
 *                         type: integer
 *                         example: 0
 *       400:
 *         description: File không hợp lệ hoặc không có file
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 */
router.post('/anh-xe/:xe_id', auth, uploadController.anhXe);

/**
 * @swagger
 * /api/upload/anh-dai-dien/{xe_id}:
 *   post:
 *     summary: Upload ảnh đại diện cho xe
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: xe_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của xe
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh (jpg, jpeg, png, webp), tối đa 5MB
 *     responses:
 *       200:
 *         description: Upload ảnh đại diện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh đại diện thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     anh_dai_dien:
 *                       type: string
 *                       example: "/images/xe/1706789123456.jpg"
 *       400:
 *         description: File không hợp lệ hoặc không có file
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy xe
 */
router.post('/anh-dai-dien/:xe_id', auth, uploadController.anhDaiDien);

/**
 * @swagger
 * /api/upload/anh-mau/{mau_id}:
 *   post:
 *     summary: Upload ảnh cho màu xe
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mau_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của màu xe
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh (jpg, jpeg, png, webp), tối đa 5MB
 *     responses:
 *       200:
 *         description: Upload ảnh màu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh màu thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     anh_mau:
 *                       type: string
 *                       example: "/images/mau/1706789123456.png"
 *       400:
 *         description: File không hợp lệ hoặc không có file
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy màu xe
 */
router.post('/anh-mau/:mau_id', auth, uploadController.anhMau);

/**
 * @swagger
 * /api/upload/tin-tuc/{tin_tuc_id}:
 *   post:
 *     summary: Upload ảnh đại diện cho tin tức
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tin_tuc_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của tin tức
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh (jpg, jpeg, png, webp), tối đa 5MB
 *     responses:
 *       200:
 *         description: Upload ảnh tin tức thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh tin tức thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     anh_dai_dien:
 *                       type: string
 *                       example: "/images/tin-tuc/1706789123456.webp"
 *       400:
 *         description: File không hợp lệ hoặc không có file
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy tin tức
 */
router.post('/tin-tuc/:tin_tuc_id', auth, uploadController.anhTinTuc);

/**
 * @swagger
 * /api/upload/anh-xe/{anh_id}:
 *   delete:
 *     summary: Xóa ảnh xe khỏi database và disk
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anh_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID của ảnh xe (AnhXe.id)
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa ảnh thành công"
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy ảnh
 */
router.delete('/anh-xe/:anh_id', auth, uploadController.deleteAnhXe);

module.exports = router;
