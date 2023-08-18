const asyncHandler = require('express-async-handler');
const { getInstanceByKey } = require('../models/instanceModel');
const { getDataByToken } = require('../models/tokenModel');
const { isEmpty } = require('../utils/functions');
const { sendError } = require('./errorMiddleware');

validateAPIKey = asyncHandler(async (req, res, next) => {
    let apiKey = req.headers['x-api-key'];

    const user = await getInstanceByKey(apiKey)

    if (user) {
        req.apiKey = user;
        next();
    }
    else {
        res.status(403)
        sendError(res, 403, new Error(`Invalid auth key`))
    }
})

validateDeviceToken = asyncHandler(async (req, res, next) => {

    if (isEmpty(req.headers['device-token'])) {
        res.status(406)
        sendError(res, 406, new Error(`device token is missing`))
    }
    else {
        const data = await getDataByToken(req.headers['device-token'])

        if (data) {
            req.deviceToken = data[0]
            next();
        }
        else {
            res.status(406)
            sendError(res, 406, new Error(`invalid device token`))
        }
    }
})

module.exports = {
    validateAPIKey,
    validateDeviceToken
}