const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const dateFormat = require("dateformat");

const { getConnection } = require("../config/database");
const conn = getConnection();

const { isEmpty } = require("../utils/functions");
const Logger = require("../utils/Logger");
const { checkUserColumn } = require("./userModel");

const userLogin = async (userName, password) => {
  const [results] = await conn.query(
    `select id,password from pr_users where email=?`,
    [userName]
  );

  if (!isEmpty(results)) {
    const result = results[0];

    if (await bcrypt.compare(password, result.password)) {
      return {
        id: result.id,
      };
    } else {
      Logger.info(`Password validation has failed`);
      return null;
    }
  } else {
    Logger.info(`User not found`);
    return null;
  }
};

const userRegister = async (params) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(params.password, salt);
  const uniq_key = uuidv4();
  const date = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");

  const checkEmail = await checkUserColumn("email", params.email);

  if (checkEmail) {
    Logger.info(`Email already exist`);
    return {
      error: new Error(`Email already exist`),
    };
  }

  const [result] = await conn.query(
    `insert into pr_users(name,lname,email,password,phone,uniq_key,date_created,status) values(?,?,?,?,?,?,?,?)`,
    [
      params.name,
      params.lname,
      params.email,
      password,
      params.phone,
      uniq_key,
      date,
      "active",
    ]
  );

  if (result.insertId > 0) {
    return result.insertId;
  }

  return null;
};

module.exports = {
  userLogin,
  userRegister,
};
