const BaseMongooseRepository = require('./BaseMongooseRepository')

const scienceClubSchema = {
    name: {
        type : String, 
        required : true, 
        unique : true, 
    },
    isopen: {
        type : Boolean, 
        deafult : false,
    },
    admins: [{ type: String, ref: 'users_accounts' }],
    members: [{ type:String, ref: 'users_accounts' }],
    university: {
        type : String, 
        default : ""
    },
    description : {
        type: String, 
        deafult : ""
    },
    rules : {
        type : String, 
        deafult : ""
    },
    joinrequests : [{ type: String, ref: 'users_accounts' }]
}

class ScienceClubRepository extends BaseMongooseRepository {
    constructor(){
        super('science_clubs', scienceClubSchema)
    }

    async create (clubData){
        const club = this.model(clubData)
        await club.save()
    }

    async FindByName (clubName) {
        const club = await this.model.findOne({ name: clubName });
        if(club){
            return club
        }
        return false
    }

    async AddJoinRequest (clubName, request){
        
        try {
            // Find the club by its ID
            const club = await this.model.findOne({ name: clubName });
    
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
    }

    async removeJoinRequest (clubName, request){
   
        let club = await this.model.findOne({ name: clubName })

        if(!club){
            return {success : false , clubFound : false}
        }

        if(!club.joinrequests.includes(request)){
            return {success : false,clubFound : true, containsRequest : false}
        }

        club.joinrequests = club.joinrequests.filter(element => element !== request);
        await club.save()

        return { success: true, clubFound : true, containsRequest : true};

    } 

    async AddMember (clubname, userId){
        try {

            const club = await this.model.findOne({ name: clubname });
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
    }

    async checkMemberShip(clubname, userId){
        let result = {admin :false, member : false}
        try{
            const club = await this.model.findOne({name : clubname})
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
    }

    async getJoinRequests(clubname){
        let result = await this.model.aggregate([
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

module.exports = ScienceClubRepository