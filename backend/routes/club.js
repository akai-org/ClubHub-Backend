const express = require('express');

const {authorize} = require('../middlewares/auth')
const {} = require('../middlewares/club')

const router = express.Router();

router.get('/:clubname', authorize('viewer:member:admin') ,async (req, res) => {
    //return data about given science club
    res.status(200).json({message:req.params.clubname});
});

router.post('/:clubname/join',authorize('user'), (req, res) => {
    //make a request to join or joins a club based on authorization token and userID
    res.status(200).json({message:`join ${req.params.name}`});
});

router.post('/:clubname/leave',authorize('user'), (req, res) => {
    res.status(200).json({message:`leave ${req.params.name}`});
});

router.post('/:clubname/invite/:inviteId', (req, res) => {
    //check in database club invite collection if invite with provided id exists check if name is also correct to given invite then add user to club based on authorization token and userID
    res.status(200).json({message:`invite to ${req.params.name}`, inviteId : req.params.inviteId});
});

module.exports = router;
