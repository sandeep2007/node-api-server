const { isEmpty } = require('../utils/functions')
const Logger = require('../utils/Logger')

const { getConnection } = require('../config/database')
const conn = getConnection()


const getDataByToken = async (token) => {

    let obj = null
    const [results] = await conn.query(`select id,user_id,data from ${process.env.DEVICE_TOKEN_TABLE} where token=?`, [token])
    if (!isEmpty(results)) {
        let result = results[0]
        obj = {
            id: result.id,
            user_id: result.user_id,
            data: result.data
        }
    }
    return obj
}

const createDeviceToken = async (params) => {
    let [result] = await conn.query(`insert into ${process.env.DEVICE_TOKEN_TABLE}(token,timestamp,data) values(?,?,?)`, [params.token, params.timestamp, params.data])

    if (result.insertId) {
        return result.insertId
    }
    else {
        return null
    }
}

const createRefreshToken = async (params) => {
    let [result] = await conn.query(`insert into ${process.env.REFRESH_TOKEN_TABLE}(token,timestamp) values(?,?)`, [params.refreshToken, params.timestamp])

    if (result.insertId) {
        return result.insertId
    }
    else {
        Logger.info(`Refresh token couldn't be created`)
        return null
    }
}

const findRefreshToken = async (token) => {

    let obj = null
    const [results] = await conn.query(`select id,token from ${process.env.REFRESH_TOKEN_TABLE} where token=?`, [token])

    if (!isEmpty(results)) {
        let result = results[0]
        obj = {
            id: result.id,
            refreshToken: result.token
        }
    }
    return obj
}

const deleteRefreshToken = async (token) => {

    const [result] = await conn.query(`delete from ${process.env.REFRESH_TOKEN_TABLE} where token=?`, [token])

    if (result.affectedRows > 0) {
        return result.affectedRows
    }
    else {
        Logger.info(`0 row affected`)
        return null
    }
}

module.exports = {
    getDataByToken,
    createDeviceToken,
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken
}