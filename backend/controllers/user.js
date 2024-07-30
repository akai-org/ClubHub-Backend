//User Controllers /controllers/user.js
const {registerUser, loginUser, findProfileData} = require('../services/user')


const register = async (req, res, next) => {
    let serviceResult; 

    try{ serviceResult = await registerUser(req.body) }
    catch(error) {
        return next(error)
    }
    res.status(200).json(serviceResult)
}

const login = async (req, res, next)=>{

    if(req.authenticated){
        res.status(200).json({succesfull : true, message : "User Authenticated by auth token", error : false}); 
        return
    }
    let result;

    //service 
    try{ result= await loginUser(req.body) }
    catch(error){
        return next(error) 
    }
    res.status(200).json(result)
}

const accountData = async (req, res, next) =>{

    console.log('account data'); 
    let result
    //service 
    try{ result = await findProfileData(req.params.uuid) }
    catch(error){
        return next(error)
    }

    result.authenticated = req.authenticated

    res.status(200).json(result)
    
}

module.exports = {register ,login, accountData}
