const express = require('express')

const { dbTest } = require('../controllers/testController')

const router = express.Router()

router.route('/').get(dbTest)


module.exports = router;