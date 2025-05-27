const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken } = require('../../../middlewares/authMiddleware');
const { verifyRootUser } = require('../../../middlewares/adminMiddleware');
const { validateEmployee, validateEmployeeFilter, validateID, validateEmployeeFilterAll } = require('../../../middlewares/validatorsEmployees');
const { upload } = require('../../../config/upload');

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
        return res.status(400).json({ error: error.message });
    }
};

router.get('/', verifyToken, employeesController.getAllEmployees);
router.get('/getDataSession', verifyToken, employeesController.returnDataSession);
router.get('/getModulesSession', verifyToken, employeesController.returnModuleSession);

router.post('/register', verifyToken, verifyRootUser, validateEmployee, employeesController.registerEmployees);
router.post('/logout', employeesController.logout);
router.post('/login', employeesController.login);
router.post('/filter', verifyToken, validateEmployeeFilter, employeesController.getEmployee);
router.post('/filterAll', verifyToken, validateEmployeeFilterAll, employeesController.filterEmployeesAll);
router.post('/recover', employeesController.recoverPassword);
router.post('/verifyCode', employeesController.verifyCode);
router.post('/verifyTokenReset', employeesController.verificationTokenReset);

router.post('/uploadPhoto', handleFileUpload, verifyToken, (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'El campo photo es requerido' });
    }
    employeesController.uploadPhoto(req, res, next);
});

router.put('/verification', employeesController.verificationToReset);
router.put('/edit', verifyToken, verifyRootUser, validateID, validateEmployee, employeesController.putEmployees);

router.delete('/delete/:id', verifyToken, verifyRootUser, validateID, employeesController.deleteEmployee);


module.exports = router;