const express = require('express');
const club = require('../controllers/club')
const validateRequestBody = require('../middlewares/validateRequestBody')

const {authorize} = require('../middlewares/auth')
const clubRouter = express.Router({mergeParams: true});

clubRouter.get('/', authorize('user'), club.getClubProfile); //TO DO 

clubRouter.delete('/', authorize('admin'), (req, res)=>{
    res.status(200).json({message : "to do delete club"})
}); //TO DO 

clubRouter.put('/edit', authorize('admin'), (req, res)=>{
    res.status(200).json({message : "to do edit club"})
}); //TO DO 

clubRouter.post('/join',authorize('user'), club.JoinRequest);

clubRouter.get('/join-requests', authorize('admin'), club.getJoinRequests);
clubRouter.post('/join-requests', authorize('admin'), validateRequestBody("uuid:accept"), club.resolveJoinRequest);

clubRouter.post('/leave',authorize('user'), (req, res) => {
    res.status(200).json({message:` to do leave club ${req.params.name}`});
});

module.exports = clubRouter;
