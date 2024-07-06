const BaseMongooseRepository = require('./BaseMongooseRepository')

const projectSchema = {
    uuid:{
        type:String, 
        required: [true, 'project document must have it\'s uuid'],
        unique: true, 
        index : true
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    beganAt :{ type: Date, 
        default : Date.now(),
    }, 
    visible : {
        type : Boolean, 
        default : true, 
    }, 
    joinFree :  {
        type : Boolean, 
        default : false, 
    }, 
    description : {
        type: String, 
        default : "empty",
        required : true,
    }, 
    owner :{
        type : String, 
        required : true, 
        ref: 'user_accounts'
    },
    participants : [ 
        { _id :false,
        uuid: {
            type: String, 
            ref: 'user_accounts'
        }, 
        responsibilities : [{ type: String }]
        }
    ], 
    externalSources :  [{ type: String }],
    involvedScienceClubs : [{ type: String, ref: 'science_clubs' }],
    technologies : [{ type: String }], 
    tags : [{ type: String }],
    currentState: { 
        type: String, 
        default : 'active'
    }, 
    joinRequests : [{type:String, ref: 'user_accounts'}]
}

class ProjectRepository extends BaseMongooseRepository{

    constructor(){
        super('projects', projectSchema)
    }

    async insert(data){
        const project = new this.model(data)
        project.save()
        return project.toObject()
    }

    async findByUuid (uuid) {
        const project = await this.model.findOne({ uuid: uuid });
        if(project){
            return project
        }
        return null
    }

    async findByUuidWithUserData(uuid){

        let result = await this.model.aggregate([
            { $match : {uuid : uuid} }, 
            {
                $lookup : {
                    from: "user_accounts",
                    localField: "owner",
                    foreignField: "uuid",
                    as: "owner",
                }
            },
            { $unwind : "$owner"},
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
                                'user': {  $arrayElemAt : [
                                        '$partInfo',
                                        { $indexOfArray: ['$partInfo.uuid', '$$p.uuid'] },
                                    ],        
                                },
                            }
                        }
                    }
                }
            },
            { $unset : "partInfo"},
            {
                $project : {
                    _id : 0, 
                    __v : 0, 
                    joinRequests : 0, 
                    owner : { password : 0, __v : 0,  _id : 0  },
                    participants : {
                        user : { _id : 0,  __v : 0, password : 0 }
                    } 
                }
            }
        ])

        return result
    }

    async addParticipant(projectId, uuid) {
        return await this.model.updateOne(
            { uuid: projectId },
            { $push: { participants: {uuid : uuid , responibilities: [] }  } }
        );
    }

    async addJoinRequest(projectId, userId) {
        return await this.model.updateOne(
            { uuid: projectId },
            { $push: { joinRequests: userId } }
        );
    }
}


module.exports = ProjectRepository