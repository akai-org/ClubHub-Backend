const {validateEmail} = require("../utils/userDataValidation")

const validateUserData = async (req, res, next)=>{
    const {email, firstName, lastName, username, password, } = req.body; 

    if(!(email && password && username)){
        res.status(400).json({succesfull :false , message: "Not all neccesary data is in request"})
        return 
    }

    if(!validateEmail(req.body.email)){
        res.status(400).json({succesfull: false, message: "No valid email format"})
        return
    }
    //is password valid 
    // is user name valid etc
    next(); 
}

module.exports = {validateUserData}