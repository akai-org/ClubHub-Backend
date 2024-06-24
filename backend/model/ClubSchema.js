const mongoose = require('mongoose');

const scienceClubSchema = new Schema({
    name: {
        type : String, 
        required : true, 
    },
    admins: [{ type: Schema.Types.ObjectId, ref: 'usersAccounts' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'usersAccounts' }]
});

const ScienceClub = mongoose.model('ScienceClub', scienceClubSchema);

module.exports = {ScienceClub};