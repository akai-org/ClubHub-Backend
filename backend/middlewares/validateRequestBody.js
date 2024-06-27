function validateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}


function validateRequestBody(requiredFields){
    return (req, res, next)=>{
        if(!requiredFields){
            console.error(`[Argument Error] On Path: ${req.method} ${req.originalUrl} no fields specified in validateRequestBody`)
            return next();      
        }

        const fields = requiredFields.split(':')
        const missingFields = fields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            console.log('Bad request :', true)
            return res.status(400).json({
                successful: false,
                message: 'Missing required fields',
                missingFields: missingFields
            });
        }

        if(req.body.email && !validateEmail(req.body.email)){
            res.status(400).json({succesfull: false, message: "No valid email format"})
            return
        }

        //also should check if those fileds are correctly formated
        console.log("Bad request :", false)
        next();
    }
}

module.exports = validateRequestBody