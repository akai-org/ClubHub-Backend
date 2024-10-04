const BaseMongooseRepository = require('./BaseMongooseRepository')

const scienceClubSchema = {

    uuid : {
        type : String,
        required :  true,
        unique : true, 
        index : true,
    },
    name: {
        type : String, 
        required : true, 
        unique : true, 
    },
    isopen: {
        type : Boolean, 
        default : false,
    },
    members: [ {
        uuid : { type:String, ref: 'users_accounts' }, 
        role : {type : String}, 
        _id : false
    }],
    university: {
        type : String, 
        default : ""
    },
    description : {
        type: String, 
        default : ""
    },
    rules : {
        type : String, 
        default : ""
    },
    joinrequests : [{ type: String, ref: 'users_accounts' }]
}

class ScienceClubRepository extends BaseMongooseRepository {
    constructor(){
        super('science_clubs', scienceClubSchema)
    }

    async insert (clubData){
        const club = this.model(clubData)
        await club.save()
        return club.toObject(); 
    }

    async findOneByQuery(query){
        const club = await this.model.findOne(query).select('-__v -_id')
        if(club){
            return club
        }
        return undefined 
    }

    async FindByName (clubName) {
        const club = await this.model.find({ name: clubName }).select('-__v -_id');
        if(club){
            return club
        }
        return false
    }

    async AddJoinRequest (clubName, request){
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
    }

    async removeJoinRequest ({university, name}, request){
   
        let club = await this.model.findOne({ university, name })

        if(!club){
            return undefined
        }

        if(!club.joinrequests.includes(request)){
            return false 
        }

        club.joinrequests = club.joinrequests.filter(element => element !== request);
        await club.save()

        return club
    } 

    async AddMember ({university, name}, userId){
        const club = await this.model.findOne({university, name});
        if(!club){ 
            return undefined
        }
        if(!club.members.includes(userId))
        {
            let memberObj ={uuid : userId, role : 'member'}; 
            club.members.push(memberObj)
            await club.save()
            return memberObj
        }
        return false 
    }

    async deleteMember ({university, name}, userId){
        const club = await this.model.findOne({university, name});

        if(!club){ 
            return undefined
        }

        if(!club.members.includes(userId))
        {
            club.members = club.members.filter(member => member.uuid !== userId);
            await club.save()
            return club.toObject()
        }
        return false
    }

    async checkMemberShip(clubname, userId){
        let result = {admin :false, member : false}
        const club = await this.model.findOne({name : clubname})
        if(club){
            const exists = club.members.find(obj => obj['uuid'] === userId);
            if(exists){
                result[exists.role] = true
            }
        }
        return result
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