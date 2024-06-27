const express = require('express');
const club = require('../controllers/club')
const validateRequestBody = require('../middlewares/validateRequestBody')

const {authorize} = require('../middlewares/auth')
const clubRouter = express.Router();

clubRouter.get('/create', authorize('user'), validateRequestBody("name:university:description"), club.Create);

clubRouter.get('/:clubname', authorize('viewer:member:admin'), club.getClubProfile);

clubRouter.post('/:clubname/join',authorize('user'), club.JoinRequest);

clubRouter.get('/:clubname/getJoinRequests', authorize('admin'), club.getJoinRequests);

clubRouter.post('/:clubname/resolveJoinRequest', authorize('viewer'),validateRequestBody("requestId:decision"), club.resolveJoinRequest)

clubRouter.post('/:clubname/leave',authorize('user'), (req, res) => {
    res.status(200).json({message:`leave ${req.params.name}`});
});

clubRouter.post('/invite/:inviteId', (req, res) => {
    //check in database club invite collection if invite with provided id exists check if name is also correct to given invite then add user to club based on authorization token and userID
    res.status(200).json({message:`invite`, inviteId : req.params.inviteId});
});

module.exports = clubRouter;
