const { createLogger, transports, format } = require("winston");
const dateFormat = require("dateformat");

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "logs",
      level: "silly",
      format: format.combine(
        format.timestamp(),
        format.printf(
          (info) =>
            `[${info.level}] ${dateFormat(
              new Date(info.timestamp),
              "yyyy-mm-dd HH:MM:ss"
            )} => ${info.message}`
        )
      ),
    }),
    new transports.File({
      filename: "error",
      level: "error",
      format: format.combine(format.timestamp(), format.simple()),
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.printf(
          (info) =>
            `[${info.level}] ${dateFormat(
              new Date(info.timestamp),
              "yyyy-mm-dd HH:MM:ss"
            )} => ${info.message.split("\t")[0]}`
        )
      ),
    })
  );
}

module.exports = logger;
