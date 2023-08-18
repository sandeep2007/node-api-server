const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const base64 = require('base-64');
const { createRefreshToken } = require('../models/tokenModel')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '60s'
    })
}

const generateRefreshToken = async (id) => {
    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '365d'
    })
    const timestamp = new Date().getTime();
    const tokenId = await createRefreshToken({ refreshToken: refreshToken, timestamp: timestamp })

    if (tokenId) {
        return refreshToken
    }
    else {
        return null
    }
}

const generateDeviceToken = () => {
    const token = base64.encode(uuidv4());
    return token;
}

module.exports = { generateToken, generateRefreshToken, generateDeviceToken }