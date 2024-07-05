
const projectService = require('../services/project')

const newProject = async (req, res, next) => {
    let {name, description, owner} = req.body
    if(!owner){
        owner = req.user.uuid
    }

    try{
        let createdProject = await projectService.startNew({name, description, owner})
        return res.status(200).json({success: true, createdProject})
    }catch(error){
        return next(error)
    }
}

const joinProject = async(req, res, next)=>{
    let userId = req.user.uuid; 
    let projectId = req.params.projectId
    try{    
        let result = await projectService.joinProject(userId, projectId)
        res.status(200).json({success : true , services : {joinProject : result}})
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
        res.status(200).json({success :true, project})
    }catch(error){
        return next(error)
    }
}

module.exports = {newProject,joinProject, editProjectData, getProjects,getOneProject}