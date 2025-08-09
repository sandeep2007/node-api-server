const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initializeDataSource, getConnection } = require("./config/database");

initializeDataSource();

const router = require("./config/router");
const Logger = require("./utils/Logger");

const app = express();
app.use(
  cors({
    origin: "http://localhost",
    methods: "GET,POST,PATCH,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_, res) => {
  res.type("html");
  res.send(`<div style="margin:-8px;width:100vw;
    height:100vh;">
    <p style="padding:8px">API Server running...</p>
    </div>`);
});

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  Logger.info(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// Graceful shutdown: close DB pool
const gracefulShutdown = async () => {
  try {
    const db = getConnection();
    if (db && typeof db.close === "function") {
      await db.close();
    }
  } catch (err) {
    Logger.error("Error during DB pool shutdown", err);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
