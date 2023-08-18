const express = require('express')

const multer = require('multer')
const formData = multer();

const { login, register, deviceToken } = require('../controllers/authController')
const { refresh } = require('../middleware/authMiddleware');
const { validateDeviceToken } = require('../middleware/tokenMiddleware');
const { loginValidation, registerValidation } = require('../validations/userValidation')

const router = express.Router()

router.route('/deviceToken').get(deviceToken)
router.route('/register').post(validateDeviceToken, formData.array(), registerValidation, register)
router.route('/login').post(validateDeviceToken, formData.array(), loginValidation, login)
router.route('/refresh').get(validateDeviceToken, refresh)


module.exports = router;