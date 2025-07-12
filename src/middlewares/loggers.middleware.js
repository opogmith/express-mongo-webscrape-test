const winston = require('winston');
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
};

//* Custom Level Filter so that only info logs are logged in Info Log File.
const levelFilter = (targetLevel) => {
  return winston.format((info) =>
    info.level === targetLevel ? info : false
  )();
};

winston.loggers.add("MorganLogger", {
  levels: customLevels.levels,
  level: "debug",
  format: combine(timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/http/Morgan.log",
      level: "http",
      format: combine(levelFilter("http"), timestamp(), json(), prettyPrint()),
    }),
  ],
  defaultMeta: { service: "MorganMiddlewareLogger" },
});

winston.loggers.add("FetchLargeJSONLogger", {
  levels: customLevels.levels,
  level: "debug",
  format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors/FetchLargeJSON.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/info/FetchLargeJSON.log",
      level: "info",
      format: combine(levelFilter("info"), timestamp(), json(), prettyPrint()),
    }),
  ],
  defaultMeta: { service: "FetchLargeJSONController" },
});

winston.loggers.add("DownloadFilesLogger", {
  levels: customLevels.levels,
  level: "debug",
  format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors/DownloadFiles.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/info/DownloadFiles.log",
      level: "info",
      format: combine(levelFilter("info"), timestamp(), json(), prettyPrint()),
    }),
  ],
  defaultMeta: { service: "DownloadFilesController" },
});

winston.loggers.add("ScrapeProductsLogger", {
  levels: customLevels.levels,
  level: "debug",
  format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errors/ScrapeProducts.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/info/ScrapeProducts.log",
      level: "info",
      format: combine(levelFilter("info"), timestamp(), json(), prettyPrint()),
    }),
  ],
  defaultMeta: { service: "ScrapeProductsController" },
});