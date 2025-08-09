const mysql = require("mysql2");
const { dbConfig } = require("../config/database");

// Base config from env; do not mutate
const baseConfig = dbConfig().mysql.default;

class Database {
  constructor() {
    this.pool = null;
  }

  // Initialize a connection pool. Keeps method signature for backward compatibility.
  connect(externalConfig) {
    const poolConfig = externalConfig || baseConfig;

    // Apply sensible pool defaults; allow override via env
    const connectionLimit = Number(process.env.DB_POOL_LIMIT || 10);
    const queueLimit = Number(process.env.DB_POOL_QUEUE_LIMIT || 0);

    this.pool = mysql.createPool({
      ...poolConfig,
      waitForConnections: true,
      connectionLimit,
      queueLimit,
    });
    return this;
  }

  // Query using the pool; returns [rows, fields] to match existing callers
  query(sql, args) {
    return new Promise((resolve, reject) => {
      if (!this.pool) return reject(new Error("MySQL pool is not initialized"));
      this.pool.query(sql, args, (err, rows, fields) => {
        if (err) return reject(err);
        resolve([rows, fields]);
      });
    });
  }

  // Gracefully end the pool
  close() {
    return new Promise((resolve, reject) => {
      if (!this.pool) return resolve(null);
      this.pool.end((err) => {
        if (err) return reject(err);
        resolve(null);
      });
    });
  }
}

module.exports = new Database();
