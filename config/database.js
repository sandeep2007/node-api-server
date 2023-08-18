const bluebird = require("bluebird");

const dbConfig = () => {
  return {
    mysql: {
      default: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password:
          process.env.DATABASE_PASSWORD !== "null" &&
          process.env.DATABASE_PASSWORD !== ""
            ? process.env.DATABASE_PASSWORD
            : "",
        database: process.env.DATABASE_NAME,
        charset: process.env.DATABASE_CHARSET,
        Promise: bluebird,
      },
      test: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password:
          process.env.DATABASE_PASSWORD !== "null" &&
          process.env.DATABASE_PASSWORD !== ""
            ? process.env.DATABASE_PASSWORD
            : "",
        database: process.env.DATABASE_NAME + 1,
        charset: process.env.DATABASE_CHARSET,
      },
    },
  };
};

const initializeDataSource = () => {
  const mysqlDatabase = require("../utils/mysql");
  global.defaultMySQLConn0 = mysqlDatabase.connect();
};

const getConnection = (connectionName) => {
  if (connectionName === "default" || connectionName === undefined) {
    return defaultMySQLConn0;
  } else {
    return null;
  }
};

module.exports = { dbConfig, getConnection, initializeDataSource };
