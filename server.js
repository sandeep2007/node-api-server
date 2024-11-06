const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initializeDataSource } = require("./config/database");

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

app.get("/", (req, res) => {
  res.type("html");
  res.send(`<div style="margin:-8px;width:100vw;
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#000">
    <h1 style="color:#fff">It's Works!</h1>
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
