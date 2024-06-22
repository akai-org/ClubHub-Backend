const database = require('../database/mongoose');

const registerUser = async (userData) => {
    //check if user is not already in databse 
    //check if email and eveything is correct from userData variable
    //hash a password and add user to databse 

    let result = await database.createNewUser(userData);
    
    if(result.succesfull){
        return {
            succesfull : 1, 
            duplicate : false,
            message : "User was registered succesfully"
        }
    } else{
        if(result.duplicate){
            return {
                succesfull : false, 
                duplicate : true,
                message : "Account already exsiting with given email"
                }
        }else{
            return {
                succesfull : true,
                duplicate : false,  
                message : "User was not registered succesfully, Internal Server problem"
                }
        }
    }

   
};

module.exports = {
    registerUser,
}