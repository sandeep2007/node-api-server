const { isEmpty } = require('../utils/functions')
const { getConnection } = require('../config/database')
const conn = getConnection()

const getUserById = async (id) => {
    let obj = null
    const [rows] = await conn.query(`select id,name,lname,email,phone from pr_users where id=?`, [id])
    if (!isEmpty(rows)) {
        let row = rows[0]
        obj = {
            id: Number(row.id),
            name: String(row.name),
            lname: String(row.lname),
            email: String(row.email),
            phone: String(row.phone),
        }
    }
    return obj
}

const checkUserColumn = async (column, value) => {
    const [rows] = await conn.query(`select id from pr_users where ${column}=?`, [value])
    if (!isEmpty(rows)) {
        return true
    }
    else {
        return false
    }
}

module.exports = {
    getUserById,
    checkUserColumn
}