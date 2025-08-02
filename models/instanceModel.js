const { isEmpty } = require("../utils/functions");
const { getConnection } = require("../config/database");
const conn = getConnection();

const getInstanceByKey = async (authKey) => {
  let obj = null;
  const [results] = await conn.query(
    `select id from ${process.env.AUTH_TABLE_NAME} where auth_key=? LIMIT 1`,
    [authKey]
  );
  if (!isEmpty(results)) {
    let result = results[0];
    obj = {
      id: Number(result.id),
    };
  }
  return obj;
};

module.exports = {
  getInstanceByKey,
};
