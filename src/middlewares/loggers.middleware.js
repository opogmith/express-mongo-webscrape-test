const winston = require('winston');
const { combine, timestamp, json, prettyPrint, errors } = winston.format;

//* Custom Level Filter so that only info logs are logged in Info Log File.
const levelFilter = (targetLevel) => {
    return winston.format((info) => (info.level === targetLevel ? info : false))();
  };

winston.loggers.add("FetchLargeJSONLogger", {
    level: "debug",
    format: combine(
        errors({stack: true}),
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/errors/FetchLargeJSON.log', level: 'error' }),
        new winston.transports.File({
            filename: 'logs/info/FetchLargeJSON.log', level: 'info', format: combine(
                levelFilter('info'),
                timestamp(),
                json(),
                prettyPrint()
        )}),
    ],
    defaultMeta: {service: 'FetchLargeJSONController'}
})