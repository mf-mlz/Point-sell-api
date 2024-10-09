const express = require('express');
const router = express.Router();
const { validationToken } = require('../middlewares/authMiddleware');

router.get('/', validationToken );


module.exports = router;