const logger = require("./winstonLogger")

class Logger {
    constructor(){
        this.logger = logger
        global.logger = this
    }

    error(...message){
        this.logger.error(...message)
    }

    fatal(...message){
        this.logger.log('fatal', ...message)
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

}

module.exports = new Logger(); 