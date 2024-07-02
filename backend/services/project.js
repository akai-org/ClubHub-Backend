const db = require('../database/mongoose')
const {Project} = require('../model/projectSchema')

const startNew = async (projectData) =>{
    projectData.uuid = Date.now(); //need to change to create some proper uuid

    let project = new Project(projectData)
    await project.save(); 
}

const editProjectData = async(editedData)=>{

}

const joinProject = async (userId, projectId) => {
    let project = await db.project.findByUuid(projectId)
    let user = await db.user.FindByUUID(userId)
    if(!project || !user){
        let result = {}
        result.foundProject = project ? true : false; 
        result.foundUser = user ? true : false;  
        return result
    }

    if(project.joinRequests.includes(userId)){
        return {success : true, message : "user already is on join request list"}
    }

    if(project.participants.some(participant => {console.log(participant); participant.uuid === userId} )){ // TO FIX !!!
        return {success : true, message : "user already is a project participant"}
    }

    if(project.joinFree){
        project.participants.push(userId)
        await project.save()
        return {success : true}
    }

    project.joinRequests.push(userId)
    await project.save()
    return {successs : true, joinRequest :true}

}

module.exports = {startNew, joinProject, editProjectData}