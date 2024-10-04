const errorStatusCodes = require('./errorStatusCodes')

class BaseError extends Error {
  constructor(name, description){
    super(description);

    this.name = name; 
    this.description = description; 
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

class APIError extends BaseError {
  constructor(error){
    super(error.name, error.description); 

    this.statusCode = errorStatusCodes[error.name] || 500; 
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.message = error.message || error.description; 
    this.originalError = error.originalError || error 

    if(error.stack) this.stack = error.stack

  }
}

class ValidationError extends BaseError{
  constructor(description) {
    super("ValidationError", description);
  }
}

class CastError extends BaseError {
  constructor(description){
    super("CastError", description)
  }
}

class AuthorizationError extends BaseError{
  constructor(description){
    super("AuthorizationError", description)
  }
}

class AlreadyInUseError extends BaseError {
  constructor(description){
    super("AlreadyInUseError", description)
  }
}

class AlreadyExistsError extends BaseError{
  constructor(description){ 
    super("AlreadyInUseError", description)
  }
}

class NotFoundError extends BaseError {
  constructor(description){
    super("NotFoundError", description)
  }
}

class AuthenticationError extends BaseError {
  constructor(description){
    super("AuthenticationError", description)
  }
}

class ConflictError extends BaseError{
  constructor(description){
    super("ConflictError", description)
  }
}

class NotImplementedError extends BaseError{
  constructor(error){
    super("NotImplementedError", error.message || error.description || 'no description provided')
    this.originalError = error
  }
}

class InternalServerError extends BaseError{
  constructor(error){
    super("InternalServerError", error.message || error.description)
  }
}

module.exports =  { 
  BaseError,
  APIError, 
  CastError, 
  ValidationError, 
  AlreadyInUseError,
  NotFoundError,
  NotImplementedError,
  InternalServerError,
  AuthenticationError,
  AuthorizationError,
  AlreadyExistsError, 
}