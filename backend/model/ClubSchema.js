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
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usersAccounts' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usersAccounts' }],
    univerity: {
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
    joinrequests : [{ type: mongoose.Schema.Types.ObjectId, ref: 'usersAccounts' }]
    //active projects (project schemas?)
    //events
    //meeting
});

const ScienceClub = mongoose.model('ScienceClubs', scienceClubSchema);

module.exports = {ScienceClub};