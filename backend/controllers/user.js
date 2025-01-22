//User Controllers /controllers/user.js
const userService = require('../services/user');
const httpStatusCode = require('../utils/httpStatusCodes');

exports.registerUser = async (req, res, next) => {
    let serviceResult; 
    serviceResult = await userService.registerUser(req.body)
    res.status(httpStatusCode.OK).json(serviceResult)
}

exports.loginUser = async (req, res, next)=>{

    if(req.authenticated){
        return res.status(httpStatusCode.OK).json({message : "User Authenticated by auth token"}); 
    }
    let result;
    result = await userService.loginUser(req.body);
    res.status(httpStatusCode.OK).json(result);
}

exports.getUserData = async (req, res, next) =>{
    let result
    result = await userService.findProfileData(req.params.uuid);
    res.status(httpStatusCode.OK).json(result);
}

exports.updateUser = async (req, res, next)=>{

    let {user} = await userService.updateUser(req.params.uuid, req.body);
    res.status(httpStatusCode.OK).json({user});
}
