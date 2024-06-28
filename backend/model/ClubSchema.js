const mongoose = require('mongoose');

const scienceClubSchema = new mongoose.Schema({
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
    //active projects (project schemas?)
    //events
    //meeting
});

const ScienceClub = mongoose.model('science_clubs', scienceClubSchema);

module.exports = {ScienceClub};