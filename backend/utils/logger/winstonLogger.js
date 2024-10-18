const winston = require('winston');
require('winston-mongodb');

const myFormat = require("./consoleLogFormat")
const config = require('config');
const path = require('path');

const env = process.env.NODE_ENV || 'production';
const loggerConfig = config.get('logger');

const customLevels = {
  levels: {
    fatal: 0,  // highest priority
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7  // lowest priority
  },
  colors: {
    fatal: "bold red",
    error: "bold red",
    warn: "yellow",
    info: "green",
    http: "green",
    verbose: "bold cyan",
    debug: "blue",
    silly: "magenta"
  }
}
/*Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
*/
const logger = winston.createLogger({
  level: loggerConfig.level,
  levels: customLevels.levels,
  format : winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports : [new winston.transports.Console()] //default transport is none is specified
});
winston.addColors(customLevels.colors);

logger.info("created logger")
logger.silly("test")

if(loggerConfig.transports && Array.isArray(loggerConfig.transports) && loggerConfig.transports.length){
  logger.clear(); 
}

// Handle different transports based on configuration "logger.transports"
if (loggerConfig.transports.includes('console')) {
  logger.add(new winston.transports.Console({
    level: loggerConfig.level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.label({label : env}),
      myFormat,
    )
  }));
}

if (loggerConfig.transports.includes('console_json')) {
  logger.add(new winston.transports.Console({
    level: loggerConfig.level,
    format : winston.format.combine( 
      winston.format.json(),
      winston.format.prettyPrint()
      )
  }));
}

if (loggerConfig.transports.includes('file')) {
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, 'logs', 'app.log'),
    level: loggerConfig.level,
    format : winston.format.combine( 
      winston.format.label({label : env}),
      myFormat()
      )
  }));
}

if (loggerConfig.transports.includes('mongodb')) {
  logger.add(new winston.transports.MongoDB({
    level: loggerConfig.level,
    db: loggerConfig.mongodb.URI,
    storeHost : true, 
    collection : loggerConfig.mongodb.collection, 
    metaKey: 'meta'
  }));
}

module.exports = logger;
