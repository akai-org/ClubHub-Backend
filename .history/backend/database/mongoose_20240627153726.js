const connectDB = require('../config/db');
const {User} = require('../model/userSchema');
const {ScienceClub} = require('../model/ClubSchema');
//mongoose indexes?
class Database{
    async connect(){
        await connectDB()
    }

    user = {
        Insert : async (userdata) => {
          
            const user = User(userdata)
            try{
                await user.save()
                return {succesfull : true, duplicate : false, message : "User saved in database"}
    
            }catch(err){
                console.log('Error creating new user: \n', err.name, err.message)
                if(err.code === 11000 || err.code === 11001)
                {
                    return {succesfull : false, duplicate : true, message : "User was not saved in databse"}
                }else{
                    return {succesfull : false, duplicate : false, error : true,  message : "User was not saved in databse"}
                }
            }
        },
        FindByUUID : async (id) => {
            try {
                const user = await User.findOne({ uuid: id });
                if(user){
                    return user
                }
                return false
            }catch(err){
                console.error(err)
                return false
            }
        },
        FindByEmail : async (email) => {
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
        },
        FindByUserName: async (username) => {
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
    
    }

    club = {
        Create : async (clubData) => {
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
        },
    
        FindByName : async (clubName) =>{
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
        },
    
        AddJoinRequest : async (clubName, request) => {
            
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
        }, 
        removeJoinRequest : async (clubName, request) => {
            try {
                const club = await ScienceClub.updateOne({ name: clubName },
                    {$pull : { joinrequests : request}},
                    {new : true})
                    .then((club) => {return club})
                    .catch( (error) => console.log(error))

                return { success: true, message: 'join request removed', club };
            } catch (error) {
                console.error('Error adding join request to club:', error);
                return { success: false, error : true, message: 'Error deleting join request', error };
            }
        }, 
        AddMember : async (clubname, userId) => {
            try {

                const club = await ScienceClub.findOne({ name: clubname });
                console.log(club)
                if(!club.members.includes(userId))
                {
                    club.members.push(userId)
                    await club.save()
                    return { success: true, message: 'Member Added to Club', club };
                }
                return { success: false, message: 'Member already is member of Club', club };
            } catch (error) {
                console.error('Error adding user to club:', error);
                return { success: false, error : true, message: 'Error adding user to club', error };
            }
        }, 
        checkMemberShip : async (clubname, userId) => {
            let result = {admin :false, member : false}
            try{
                const club = await ScienceClub.findOne({name : clubname})
                console.log(club.members)
                if(club){
                    if(club.admins.includes(userId)){
                        result.admin = true; 
                    }

                    if(club.members.includes(userId)){
                        result.member = true
                    }
                    
                }
                return result
            }catch(error){
                console.error("error while checking membership", error)
                return {admin :false, member : false}
            }
        }, 
        getJoinRequests : async (clubname) =>{
            let result = await ScienceClub.aggregate([
                {$match : { name : clubname}}, 
                {$limit : 1},
                {$lookup : {
                    from : 'user_accounts', 
                    localField : 'joinrequests', 
                    foreignField : 'uuid', 
                    as : 'join_requests_info'
                    }}, 
                { $project : {
                    name : 1, 
                    join_requests_info: {
                        email : 1, 
                        uuid : 1
                    }
                }

                }
            ]);
            result = result[0]

            let validRequests = result.join_requests_info.map(request => request.uuid)

            await ScienceClub.updateOne(
                { name: result.name },
                { $set: { joinrequests: validRequests } }
            );

            return result
        }
    }

}

module.exports = new Database(); 