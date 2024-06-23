const connectDB = require('../config/db');
const {User, tokenSchema} = require('../model/userSchema');

class Database{
    async connect(){
        await connectDB()
    }

    async createNewUser(userdata){
          
        const user = User(userdata)
        try{
            await user.save()
            return {succesfull : true, duplicate : false, message : "User saved in database"}

        }catch(err){
            console.log('Error creating new user: \n', err.name, err.message)
            if(err.code === 11000 || err.code === 11001)
            {
                return {succesfull : false, duplicate : true, message : "User was not saved in databse", error : err.name, errormsg : err.message}
            }else{
                return {succesfull : false, duplicate : false, message : "User was not saved in databse", error : err.name, errormsg : err.message}
            }
        }
    }

    async checkForUserByEmail(email){
        try {
            const user = await User.findOne({ email: email });
            if(user){
                return user
            }
            return false
        }catch(err){
            console.error(err)
            return false
        }
    }

    async addTokenForUser(user, token){
        try{
            await user.auth.push({token: token})
            await user.save(); 
            return true;
        }catch(error){
            console.error(error)
            console.log("error when adding new user auth token ")
            return false
        }
    }
}

module.exports = new Database(); 