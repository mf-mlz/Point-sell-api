const express = require('express');
const multer = require('multer');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyAdminRole } = require('../../../middlewares/adminMiddleware');
const { upload } = require('../../../config/upload');
const { validateProduct, validateID, validateProductFilter } = require('../../../middlewares/validatorsProducts');


const handleFileUpload = async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            upload.single('photo')(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        return reject(new Error(`Error al Cargar el Archivo`));
                    } else {
                        return reject(new Error(`Error al Cargar el Archivo`));
                    }
                }
                resolve();
            });
        });
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

router.get('/', verifyToken, productsController.getAllProducts);
router.get('/filter', verifyToken, validateProduct, validateProductFilter, productsController.filterProducts);

router.post('/register', verifyToken, verifyAdminRole, productsController.registerProducts);
router.post('/upload', handleFileUpload, verifyToken, (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'El campo photo es requerido' });
    }
    productsController.uploadPhoto(req, res, next);
});

router.put('/edit', verifyToken, validateID, validateProduct, verifyAdminRole, productsController.putProducts);

router.delete('/delete', verifyToken, validateID, verifyAdminRole, productsController.deleteProduct);

module.exports = router;