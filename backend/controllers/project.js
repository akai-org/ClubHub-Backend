const projectService = require('../services/project')

const newProject = async (req, res, next) => {
    let {name, description, owner} = req.body
    try{
        await projectService.startNew({name, description, owner})
        return res.status(200).json({success: true})
    }catch(error){
        return next(error)
    }
}

const joinProject = async(req, res, next)=>{
    try{    
        console.log(req.params.projectId)
        let result = await projectService.joinProject(req.user.uuid, req.params.projectId)
        res.status(200).json(result)
    }catch(error){
        next(error)   
    }
}

const editProjectData = async(req, res, next) =>{
    
}

const getProjects = async(req, res, next) =>{

}

module.exports = {newProject,joinProject, editProjectData, getProjects}