const { http } = require('winston')
const httpStatusCode = require('../httpStatusCodes')

errorStatusCodes = {
    
    'CastError' : httpStatusCode.BAD_REQUEST, 
    'ValidationError': httpStatusCode.BAD_REQUEST,
    'AlreadyInUseError' : httpStatusCode.CONFLICT,
    'NotFoundError' : httpStatusCode.NOT_FOUND,
    'NotImplementedError' : httpStatusCode.INTERNAL_SERVER_ERROR,
    'InternalServerError' : httpStatusCode.INTERNAL_SERVER_ERROR,
    'AuthenticationError' : httpStatusCode.UNAUTHORIZED, 
    'AuthorizationError' : httpStatusCode.UNAUTHORIZED,
    'AlreadyExistsError' : httpStatusCode.CONFLICT, 
    'ImmutableFieldError' : httpStatusCode.FORBIDDEN,
}

module.exports = errorStatusCodes