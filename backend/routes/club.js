const express = require('express');

const clubRouter = express.Router({mergeParams: true}); 

const clubController = require('../controllers/club')
const {validateRequest} = require('../middlewares/validateRequestBody')
const {newProject} = require('../controllers/project')
const {authorize} = require('../middlewares/auth')
const {createProjectValidSchema, joinRequestAcceptValidSchema} = require('../utils/validationJoiSchema')

/*Router used by route:
/:university/:clubname
*/
//GET
clubRouter.get('/', 
    authorize('user'), 
    clubController.getClubData);

clubRouter.get('/join-requests', 
    authorize('admin'), 
    clubController.getJoinRequests);

//POST
clubRouter.post('/join',
    authorize('user'), 
    clubController.createJoinRequest); 

clubRouter.post('/join-requests', 
    authorize('admin'), 
    validateRequest(joinRequestAcceptValidSchema), 
    clubController.resolveJoinRequest);

clubRouter.post('/project',  
    validateRequest(createProjectValidSchema),
    newProject)

module.exports = clubRouter;
