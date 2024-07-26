const httpStatusCode = require('./httpStatusCodes')

errorStatusCodes = {
    'ValidationError': httpStatusCode.BAD_REQUEST,
    'CastError' : httpStatusCode.BAD_REQUEST, 
    'AlreadyInUseError' : httpStatusCode.CONFLICT,
    'NotFoundError' : httpStatusCode.NOT_FOUND,
    'NotImplementedError' : httpStatusCode.INTERNAL_SERVER_ERROR,
    'InternalServerError' : httpStatusCode.INTERNAL_SERVER_ERROR,
    'AuthenticationError' : httpStatusCode.UNAUTHORIZED, 
}

module.exports = errorStatusCodes