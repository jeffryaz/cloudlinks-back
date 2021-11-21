const winston = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");
var path = require("path");

const logDir = path.dirname(require.main.filename) + "/log/";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: "log-error-query %DATE%.log",
  dirname: logDir,
  datePattern: "DD-MM-YYYY",
  maxSize: "20m",
});

const winstonLogger = new winston.Logger({
  transports: [transport],
});

const loggerQuery = {
  info: async (params) => {
    winstonLogger.info(JSON.stringify({ data: params }));
  },
  error: async (params) => {
    winstonLogger.error(JSON.stringify({ data: params }));
  },
};

module.exports = loggerQuery;
