//const logger = require("./winstonLogger")
const winston = require('winston');
require('winston-mongodb');

const myFormat = require("./consoleLogFormat")
const path = require('path');

const env = process.env.NODE_ENV || 'production';

class Logger {
    constructor(){
        this.customLevels = {
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
        
        this.logger = winston.createLogger({
          level: "verbose",
          levels: this.customLevels.levels,
          format : winston.format.combine(
            winston.format.colorize(),
            winston.format.label({label : env}),
            myFormat,
          ),
          transports : [new winston.transports.Console()] //default transport is none is specified
        });
        winston.addColors(this.customLevels.colors);
    }

    error(...message){
        this.logger.error(...message)
    }

    fatal(...message){
        this.logger.fatal(...message)
    }

    warn(...message){
        this.logger.warn(...message)
    }

    info(...message){
        this.logger.info(...message)
    }

    verbose(...message){
        this.logger.verbose(...message)
    }

    debug(...message){
        this.logger.debug(...message)
    }

    async configure(config){ 
        const newlogger = winston.createLogger({
            level: "verbose",
            levels: this.customLevels.levels,
            format : winston.format.combine(
                winston.format.colorize(),
                winston.format.label({label : env}),
                myFormat,
            ),
            transports : [new winston.transports.Console()] //default transport is none is specified
          });

        if(config.transports && Array.isArray(config.transports) && config.transports.length > 0 ){
            newlogger.clear(); 

        }
        
        // Handle different transports based on configuration "logger.transports"
        if (config.transports.includes('console')) {
            newlogger.add(new winston.transports.Console({
              level: config.level,
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.label({label : env}),
                myFormat,
              )
            }));
        }
        
        if (config.transports.includes('console_json')) {
            newlogger.add(new winston.transports.Console({
            level: config.level,
            format : winston.format.combine( 
                winston.format.json(),
                winston.format.prettyPrint()
                )
            }));
        }
        
        if (config.transports.includes('file')) {
            newlogger.add(new winston.transports.File({
            filename: path.join(__dirname, 'logs', 'app.log'),
            level: config.level,
            format : winston.format.combine( 
                winston.format.uncolorize(), // Remove colors for file transport
                winston.format.label({label : env}),
                myFormat
                )
            }));
        }
        
        if (config.transports.includes('mongodb')) {
            if(!config.mongodb){
                this.logger.fatal("logger mongodb URI is not defined!")
                throw new Error("logger mongodb URI is not defined!")
            }

            newlogger.add(new winston.transports.MongoDB({
                level: config.level,
                db: config.mongodb.URI,
                storeHost : true, 
                collection : config.mongodb.collection, 
                metaKey: 'meta'
            }));
        }
        this.logger = newlogger; 
    }

}

module.exports = new Logger(); 