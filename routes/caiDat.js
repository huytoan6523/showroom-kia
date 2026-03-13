const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const caiDatController = require('../controllers/caiDatController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CaiDat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ten_cong_ty:
 *           type: string
 *           example: "Showroom KIA ABC"
 *         dia_chi:
 *           type: string
 *           example: "123 Đường ABC, Quận 1, HCM"
 *         so_dien_thoai:
 *           type: string
 *           example: "028 1234 5678"
 *         email:
 *           type: string
 *           example: "contact@kia-abc.com"
 *         gio_lam_viec:
 *           type: string
 *           example: "8:00 - 18:00, T2 - T7"
 *         facebook:
 *           type: string
 *           example: "https://facebook.com/showroomkia"
 *         zalo:
 *           type: string
 *           example: "0909123456"
 *         gioi_thieu:
 *           type: string
 *           example: "Nội dung giới thiệu công ty..."
 */

/**
 * @swagger
 * /api/cai-dat:
 *   get:
 *     summary: Lấy thông tin công ty
 *     tags: [Cài đặt]
 *     responses:
 *       200:
 *         description: Lấy cài đặt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy cài đặt thành công"
 *                 data:
 *                   $ref: '#/components/schemas/CaiDat'
 */
router.get('/', caiDatController.get);

/**
 * @swagger
 * /api/cai-dat:
 *   put:
 *     summary: Cập nhật thông tin công ty
 *     tags: [Cài đặt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ten_cong_ty:
 *                 type: string
 *                 example: "Showroom KIA ABC"
 *               dia_chi:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, HCM"
 *               so_dien_thoai:
 *                 type: string
 *                 example: "028 1234 5678"
 *               email:
 *                 type: string
 *                 example: "contact@kia-abc.com"
 *               gio_lam_viec:
 *                 type: string
 *                 example: "8:00 - 18:00, T2 - T7"
 *               facebook:
 *                 type: string
 *                 example: "https://facebook.com/showroomkia"
 *               zalo:
 *                 type: string
 *                 example: "0909123456"
 *               gioi_thieu:
 *                 type: string
 *                 example: "Nội dung giới thiệu công ty..."
 *     responses:
 *       200:
 *         description: Cập nhật cài đặt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật cài đặt thành công"
 *                 data:
 *                   $ref: '#/components/schemas/CaiDat'
 *       401:
 *         description: Không có quyền truy cập
 */
router.put('/', auth, caiDatController.update);

module.exports = router;
