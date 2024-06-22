const connectDB = require('../config/db');
const User = require('../model/userSchema');

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

    async 
}

module.exports = new Database(); 