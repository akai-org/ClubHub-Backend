const express = require('express');
const projectRouter = express.Router();

const {newProject, joinProject, editProjectData, getProjects} = require('../controllers/project')
const validateRequestBody = require('../middlewares/validateRequestBody')
const {authorize} = require('../middlewares/auth')

projectRouter.post('/new', authorize('user'), validateRequestBody('name'), newProject)
projectRouter.post('/:projectId/join', authorize('user'), joinProject) //TO FIX
projectRouter.post('/:projectId/edit', authorize('projOwner'), editProjectData) // TO DO 
projectRouter.get('/getProjects', authorize('viewer'), getProjects) //TO DO, FILTERS?

module.exports = projectRouter;
