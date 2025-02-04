const errors = require('../utils/error/appError');
const logger = require('../utils/logger/instance')

exports.validateRequest = (schema, options = {errType : errors.ValidationError, property : 'body'}) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[options.property], { abortEarly: false });
    if (error) {
      logger.debug(`Valid request body : ${false}`);

      let message = error.details.map(detail => detail.message);
      message = message.map(str => str.replace(/"(.*?)"/, '$1:')).join(';');
      next(new options.errType(message));
      return; 
    }
    logger.debug(`Valid request body : ${true}`);
    next();
  };
}