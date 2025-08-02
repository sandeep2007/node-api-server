const asyncHandler = require("express-async-handler");
const { getConnection } = require("../config/database");
const conn = getConnection();

const dbTest = asyncHandler(async (req, res) => {
  const [results] = await conn.query(
    `select * from ${process.env.USERS_TABLE} where id=?`,
    [2]
  );
  res.send(results);
});

module.exports = {
  dbTest,
};
