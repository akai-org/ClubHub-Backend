const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
        deafult : true, 
    }, 
    joinFree :  {
        type : Boolean, 
        deafult : false, 
    }, 
    description : {
        type: String, 
        deafult : "empty",
        required : true,
    }, 
    owner :{
        type : String, 
        required : true, 
        ref: 'user_accounts'
    },
    participants : [ { userUuid: {
        type:String, 
        ref: 'user_accounts'
    }, 
    responsibilities : [{ type: String }]
    }], 
    externalSources :  [{ type: String }],
    involvedScienceClubs : [{ type: String, ref: 'science_clubs' }],
    technologies : [{ type: String }], 
    tags : [{ type: String }],
    currentState: { 
        type: String, 
        deafult : 'active'
    }, 
    joinRequests : [{type:String, ref: 'user_accounts'}]
});

const Project = mongoose.model('projects', projectSchema);

module.exports = {Project};