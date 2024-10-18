const winston = require("winston")

let customLogFormat = winston.format.printf(({level, message, label, timestamp, ...meta}) => {
            
    let prettyPrint = require('config').get("logger.options.prettyPrint") ? 2 : 0;
    message = `[${new Date(Date.now()).toISOString()}] ${label} ${level} \t: ${message} `;
    if(meta){
        let stringMeta = JSON.stringify(meta, null,  prettyPrint)
        message = stringMeta !== "{}" ? message + `| meta:${stringMeta}` : message;
    }
    return message;
})

module.exports = customLogFormat; 