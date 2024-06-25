const connectDB = require('../config/db');
const {User} = require('../model/userSchema');
const {ScienceClub} = require('../model/ClubSchema');
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

    async CreateClub(clubData){
        const club = ScienceClub(clubData)
        try{
            await club.save()
            return {succesfull : true, duplicate : false, message : "Club saved in database"}

        }catch(err){
            console.log('Error creating new club: \n', err.name, err.message)
            if(err.code === 11000 || err.code === 11001)
            {
                return {succesfull : false, duplicate : true, message : "Club was not saved in databse", error : err.name, errormsg : err.message}
            }else{
                return {succesfull : false, duplicate : false, message : "Club was not saved in databse", error : err.name, errormsg : err.message}
            }
        }
    }

    async FindClub(clubName){
        try {
            const club = await ScienceClub.findOne({ name: clubName });
            if(club){
                return club
            }
            return false
        }catch(err){
            console.error(err)
            return false
        }
    }

    async AddJoinRequestToClub(clubName, request){
        
        try {
            // Find the club by its ID
            const club = await ScienceClub.findOne({ name: clubName });
    
            if (!club) {
                return { success: false, message: 'Club not found' };
            }
    
            // Check if the user ID is already in the array
            if (club.joinrequests.includes(request)) {

                return { success: false, message: 'User already send join request' };
            }
            club.joinrequests.push(request);
            await club.save();
    
            return { success: true, message: 'Request Send', club };
        } catch (error) {
            console.error('Error adding user to club:', error);
            return { success: false, error : true, message: 'Error adding user to club', error };
        }
    };

}

module.exports = new Database(); 