const asyncHandler = require('express-async-handler')
const base64 = require('base-64');

const { generateToken, generateRefreshToken, generateDeviceToken } = require('../utils/generateToken')
const { createDeviceToken } = require('../models/tokenModel');
const { userLogin, userRegister } = require('../models/authModel');
const { getUserById } = require('../models/userModel');
const Logger = require('../utils/Logger');
const { sendError } = require('../middleware/errorMiddleware');

const login = asyncHandler(async (req, res) => {
    const userAuth = await userLogin(req.body.username, req.body.password)

    if (userAuth) {

        const user = await getUserById(userAuth.id)

        if (user) {
            const payload = Object.assign(user, {
                tokens: {
                    accessToken: generateToken(user.id),
                    refreshToken: await generateRefreshToken(user.id)
                }
            })
            res.send(payload)
        }
        else {
            Logger.info(`User not found by getUserById()`)
            res.status(400)
            sendError(res, 400, new Error(`Incorrect login attempt, user not found`))
        }
    }
    else {
        Logger.info(`User not found by userLogin()`)
        res.status(400)
        sendError(res, 400, new Error(`Incorrect login attempt, user not found`))
    }
})

const register = asyncHandler(async (req, res) => {

    const userId = await userRegister({
        name: req.body.name,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    })

    if (!userId.error) {
        const user = await getUserById(userId)

        if (user) {
            const payload = Object.assign(user, {
                tokens: {
                    accessToken: generateToken(user.id),
                    refreshToken: await generateRefreshToken(user.id)
                }
            })
            res.send(payload)
        }
        else {
            Logger.info(`User not found`)
            sendError(res, 404, new Error(`User not found`))
        }
    }
    else {
        res.status(400)
        sendError(res, 400, userId.error)
    }
})

const deviceToken = asyncHandler(async (req, res) => {

    const token = generateDeviceToken();
    const timestamp = new Date().getTime();
    let data = {};
    const currentUa = base64.encode(req.headers['user-agent'])
    data.user_agent = currentUa
    data.remote_ip = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    data.user_id = null
    data = JSON.stringify(data)

    const deviceToken = await createDeviceToken({
        token: token,
        timestamp: timestamp,
        data: data
    })

    if (deviceToken) {
        res.status(200).json({
            deviceToken: token
        })
    }
    else {
        Logger.error(new Error(`Error in device token generation`))
        sendError(res, 500, new Error(`Error in device token generation`))
    }

})

module.exports = {
    login,
    register,
    deviceToken
}