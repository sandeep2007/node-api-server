const mysql = require("mysql2");
const { dbConfig } = require("../config/database");

const config = dbConfig().mysql.default;

class Database {
  constructor() {
    this.connection = null;
  }
  connect(external_config) {
    if (external_config) {
      config = external_config;
    }
    this.connection = mysql.createConnection(config);
    return this;
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows, fields) => {
        if (err) return reject(err);
        resolve([rows, fields]);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve(null);
      });
    });
  }
}

module.exports = new Database();
