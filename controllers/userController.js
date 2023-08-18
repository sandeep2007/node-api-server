const asyncHandler = require('express-async-handler')
const { sendError } = require('../middleware/errorMiddleware')
const { getUserById } = require('../models/userModel')
const Logger = require('../utils/Logger')


const profile = asyncHandler(async (req, res) => {

    const user = await getUserById(req.user.id)
    if (user) {
        res.send(user)
    }
    else {
        Logger.info(`User not found`)
        sendError(res, 404, new Error(`User not found`))
    }
})

module.exports = {
    profile
}