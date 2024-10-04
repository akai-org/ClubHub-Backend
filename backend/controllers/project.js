const httpStatusCode = require('../utils/httpStatusCodes')
const projectService = require('../services/project')

const newProject = async (req, res, next) => {
    let body = req.body, createdProject;

    body.owner = req.user.uuid // owner is user that creating a project he is already auth as member of club
    body.university = req.params.university; // passed from a path if many clubs are working on proj invite them
    body.club = req.params.clubname
    
    try{       

        createdProject = await projectService.startNew(body) 
    }catch(error){
        return next(error)
    }

    res.status(httpStatusCode.OK).json(createdProject)
}

const joinProject = async(req, res, next)=>{
    let userId = req.user.uuid; 
    let projectId = req.params.projectId
    try{    
        let result = await projectService.joinProject(userId, projectId)
        res.status(httpStatusCode.OK).json({success : true})
    }catch(error){
        return next(error)   
    }
}

const addProjectPartiipant = async(req, res, next) =>{

}

const editProjectData = async(req, res, next) =>{
    
}

const getProjects = async(req, res, next) =>{

}

const getOneProject = async(req, res, next) =>{
    const { projectId } = req.params
    try {
        let project = await projectService.getOneProjectData(projectId)
        res.status(httpStatusCode.OK).json({project})
    }catch(error){
        return next(error)
    }
}

module.exports = {newProject,joinProject, editProjectData, getProjects,getOneProject}