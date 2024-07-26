const errorStatusCodes = require('./errorStatusCodes')

class BaseError extends Error {
  constructor(name, description, isOperational){
    super(description);

    this.name = name; 
    this.description = description; 
    this.isOperational = isOperational; 
    //Object.setPrototypeOf(this, new.target.prototype);
    // Object.assign(this, info);

    Error.captureStackTrace(this, this.constructor);
  }
}

class APIError extends BaseError {
  constructor(error){
    super(error.name, error.description, error.isOperational); 
    this.statusCode = errorStatusCodes[error.name] || 500; 
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = "TO DO!"; 
    this.detail = "TO DO!"; 
    this.instance = 'TO DO!';

    if(error.stack) this.stack = error.stack

  }
}

class ValidationError extends BaseError{
  constructor(description) {
    super("ValidationError", description, true);
  }
}

class CastError extends BaseError {
  constructor(description){
    super("CastError", description, true)
  }
}

class AuthorizationError extends BaseError{
  constructor(description){
    super("AuthorizationError", description, true)
  }
}

class AlreadyInUseError extends BaseError {
  constructor(description){
    super("AlreadyInUseError", description, true)
  }
}

class NotFoundError extends BaseError {
  constructor(description){
    super("NotFoundError", description, true)
  }
}

class AuthenticationError extends BaseError {
  constructor(detail){
    super("AuthenticationError", detail, true)
  }
}

class ConflictError extends BaseError{
  constructor(description){
    super("ConflictError", description , true)
  }
}

class NotImplementedError extends BaseError{
  constructor(error){
    super("NotImplementedError", error.description, true)
    this.originalError = error
  }
}

class InternalServerError extends BaseError{
  constructor(error){
    super("InternalServerError", error.message || error.description, true)
  }
}

module.exports =  { 
  BaseError,
  APIError, 
  CastError, 
  ValidationError, 
  NotImplementedError,
  AlreadyInUseError,
  AuthorizationError,
  AuthenticationError,
  NotFoundError
}