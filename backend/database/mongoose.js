const connectDB = require('../config/db');
const {User} = require('../model/userSchema');
//mongoose indexes?
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
            var emailfield
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
    async checkForUserByUserName(username){
        try {
            var emailfield
            const user = await User.findOne({ username: username });
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

    async searchClub(name){
        User.index({ name: 'text', email: 'text' });
    }
}

module.exports = new Database(); 