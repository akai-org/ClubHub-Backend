const connectDB = require('../config/db');
const {User} = require('../model/userSchema');
const {ScienceClub} = require('../model/ClubSchema');
const {Project} = require('../model/projectSchema')
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
                return {succesfull : true, duplicate : false, message : "User saved in database", error :false}
    
            }catch(err){
                console.log('Error creating new user: \n', err.name, err.message)
                if(err.code === 11000 || err.code === 11001)
                {
                    return {succesfull : false, duplicate : true, message : "User was not saved in databse", error :false}
                }else{
                    return {succesfull : false, duplicate : false,  message : "User was not saved in databse", error : true}
                }
            }
        },
        FindByUuid : async (id) => {
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
        create : async (clubData) => {
            const club = ScienceClub(clubData)
            await club.save()
        },
    
        FindByName : async (clubName) =>{
            const club = await ScienceClub.findOne({ name: clubName });
            if(club){
                return club
            }
            return false
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
       
            let club = await ScienceClub.findOne({ name: clubName })

            if(!club){
                return {success : false , clubFound : false}
            }

            if(!club.joinrequests.includes(request)){
                return {success : false,clubFound : true, containsRequest : false}
            }

            club.joinrequests = club.joinrequests.filter(element => element !== request);
            await club.save()

            return { success: true, clubFound : true, containsRequest : true};

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

    project = {
        findByUuid: async (uuid) =>{
            const project = await Project.findOne({ uuid: uuid });
            if(project){
                return project
            }
            return null
        },
        findByUuidWithUserData : async (uuid) =>{

            let result = await Project.aggregate([
                {
                    $match : {uuid : uuid}
                }, 
                {
                    $lookup : {
                        from: "user_accounts",
                        localField: "owner",
                        foreignField: "uuid",
                        as: "owner",
                    }
                },
                {
                    $unwind : "$owner"
                },
                {
                    $lookup : {
                        from: "user_accounts",
                        localField: "participants.uuid",
                        foreignField: "uuid",
                        as: "partInfo",
                    }
                },
                {
                    $addFields : {
                        "participants" : {
                            $map :{
                                input: "$participants", 
                                as : "p", 
                                in :{
                                    "responibilities" : "$$p.responsibilities",
                                    'user': {
                                        $arrayElemAt : [
                                            '$partInfo',
                                            {
                                            $indexOfArray: [
                                                '$partInfo.uuid',
                                                '$$p.uuid'
                                                ]
                                            },
                                        ],
                                                
                                    },
                                }
                            }
                        }
                    }
                },
                {
                    $unset : "partInfo"
                },
                {
                    $project : {
                        _id : 0, 
                        __v : 0, 
                        joinRequests : 0, 
                        owner : {
                            password : 0,
                            __v : 0, 
                            _id : 0  
                        },
                        participants : {
                            user : {
                                _id : 0, 
                                __v : 0,
                                password : 0
                            }
                        } 

                    }
                }
            ])

            return result
        },
    }
}

module.exports = new Database(); 