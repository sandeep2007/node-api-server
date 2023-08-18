const express = require('express')

const router = express.Router()

const { validateAPIKey } = require('../middleware/tokenMiddleware');
router.use(validateAPIKey)

const userRoutes = require('../routes/userRoutes')
const authRoutes = require('../routes/authRoutes')
// const testRoutes = require('../routes/testRoutes')

router.use('/user', userRoutes)
router.use('/auth', authRoutes)
// router.use('/test', testRoutes)

module.exports = router