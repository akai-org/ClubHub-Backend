const httpStatusCode = require('../utils/httpStatusCodes')
const projectService = require('../services/project')

exports.newProject = async (req, res, next) => {
    let body = req.body;

    body.owner = req.user.uuid // owner is user that creating a project he is already auth as member of club
    body.university = req.params.university; // passed from a path if many clubs are working on proj invite them
    body.club = req.params.clubname
    
    let createdProject = await projectService.startNew(body) 

    res.status(httpStatusCode.OK).json(createdProject)
}

exports.joinProject = async(req, res, next)=>{
    let userId = req.user.uuid; 
    let projectId = req.params.projectId
    try{    
        let result = await projectService.joinProject(userId, projectId)
        res.status(httpStatusCode.OK).json({success : true})
    }catch(error){
        return next(error)   
    }
}

exports.addProjectPartiipant = async(req, res, next) =>{

}

exports.editProjectData = async(req, res, next) =>{
    
}

exports.getProjects = async(req, res, next) =>{

}

exports.getOneProject = async(req, res, next) =>{
    const { projectId } = req.params
    
    let project = await projectService.getOneProjectData(projectId);
    res.status(httpStatusCode.OK).json({project});
}