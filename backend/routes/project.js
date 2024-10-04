const express = require('express');
const projectRouter = express.Router();

const {newProject, joinProject, editProjectData, getProjects, getOneProject} = require('../controllers/project')
const validateRequest = require('../middlewares/validateRequestBody')

const {authorize} = require('../middlewares/auth')

//POST
projectRouter.post('/new',validateRequest(), authorize('user'), newProject)

projectRouter.post('/:projectId/join', authorize('user'), joinProject)

projectRouter.post('/:projectId/edit', authorize('project_owner'), editProjectData) // TO DO 

//GET
projectRouter.get('/:projectId', authorize('viewer'), getOneProject)
projectRouter.get('/getProjects', authorize('viewer'), getProjects)

module.exports = projectRouter;
