const winstonLogger = require('../config/winstonLogger')

class Logger {

    info(message) {
        winstonLogger.info(`${message} \t ${(new Error().stack).replace('Error', '')}`)
    }

    error(message) {
        winstonLogger.error(`${message.stack || message + ' ' + (new Error().stack).replace('Error', '')}`)
    }
}

module.exports = new Logger