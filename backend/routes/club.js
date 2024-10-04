const express = require('express');

const clubRouter = express.Router({mergeParams: true}); 

const clubControllers = require('../controllers/club')
const validateRequest = require('../middlewares/validateRequestBody')
const {newProject} = require('../controllers/project')
const {authorize} = require('../middlewares/auth')
const {createProjectValidSchema, joinRequestAcceptValidSchema} = require('../utils/validationJoiSchema')

/*Router used by route:
/:university/:clubname
*/
//GET
clubRouter.get('/', 
    authorize('user'), 
    clubControllers.getClubProfile);

clubRouter.get('/join-requests', 
    authorize('admin'), 
    clubControllers.getJoinRequests);

//POST
clubRouter.post('/join',
    authorize('user'), 
    clubControllers.sendJoinRequest); 

clubRouter.post('/join-requests', 
    authorize('admin'), 
    validateRequest(joinRequestAcceptValidSchema), 
    clubControllers.resolveJoinRequest);

clubRouter.post('/project',  
    validateRequest(createProjectValidSchema), //authorize(member) /* await checkMembership(req.user.uuid, {university : params.university, clubname : params.clubname })*/ */
    newProject)

module.exports = clubRouter;
