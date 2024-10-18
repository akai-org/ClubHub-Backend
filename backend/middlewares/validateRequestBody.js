const errors = require('../utils/error/appError')

function validateRequest(schema, property = 'body'){
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      logger.debug(`Valid request body : ${false}`);

      let message = error.details.map(detail => detail.message);

      message = message.map(str => str.replace(/"(.*?)"/, '$1:')).join(';');

      next(new errors.ValidationError(message));
      return; 
    }
    logger.debug(`Valid request body : ${true}`);
    next();
};
}

module.exports = validateRequest