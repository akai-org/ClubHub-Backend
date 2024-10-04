const errors = require('../utils/error/appError')

function validateRequest(schema, property = 'body'){
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    console.log('VALIDATE REQUEST')

    if (error) {
      //console.log(error)
      let message = error.details.map(detail => detail.message).join('\n')
      next(new errors.ValidationError(message))
    }
    next();
};
}

module.exports = validateRequest