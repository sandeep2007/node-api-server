const Logger = require("../utils/Logger");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  Logger.error(error);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

const sendError = (res, status, error) => {
  res.status(status);
  res.send({
    message: error.message || error,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

module.exports = { notFound, errorHandler, sendError };
