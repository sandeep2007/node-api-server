const express = require('express')

const { protect } = require('../middleware/authMiddleware')
const { profile } = require('../controllers/userController')
const { validateAPIKey, validateDeviceToken } = require('../middleware/tokenMiddleware')

const router = express.Router()

router.route('/').get(validateAPIKey, validateDeviceToken, protect, profile)

module.exports = router;