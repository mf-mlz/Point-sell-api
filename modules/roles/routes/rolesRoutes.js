const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');

router.get('/', verifyToken, rolesController.getRoles);

module.exports = router;