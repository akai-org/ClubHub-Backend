const {validateEmail} = require("../utils/userDataValidation")

const validateUserData = async (req, res, next)=>{
    console.log("validating")
    const {email, name, password} = req.body; 

    if(!(email && name && password)){
        res.status(400).json({succesfull :false , message: "not all neccesary data is in request"})
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