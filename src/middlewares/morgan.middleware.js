const morgan = require("morgan");
require("./loggers.middleware");
const Logger = require("winston").loggers.get("MorganLogger");

//*Custom Morgan Middleware with Winston Logger
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => {
        Logger.http(message.trim());
      },
    },
  }
);

module.exports = morganMiddleware;
