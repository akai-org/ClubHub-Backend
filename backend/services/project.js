const db = require('../database/mongoose')
const {Project} = require('../model/projectSchema')

const startNew = async (projectData) =>{
    projectData.uuid = Date.now(); //need to change to create some proper uuid

    let project = new Project(projectData)
    await project.save(); 
    const { _id, participants,joinRequests , __v ,...resultproject} = project.toObject()
    return resultproject
}

const editProjectData = async(editedData)=>{

}

const joinProject = async (userId, projectId) => {

    let result = {
        success : false, 
        correct : {
            projectId : false, 
            userId : false
        },
        addedJoinRequest : false, 
        addedParticipants : false, 
        alreadyJoinRequest : false, 
        alreadyParticipant : false
    }

    let project = await db.project.findByUuid(projectId)
    let user = await db.user.FindByUuid(userId)

    result.correct.projectId = project ? true : false; 
    result.correct.userId = user ? true : false;  

    if(!project || !user){
        return result
    }

    if(project.joinRequests.includes(userId)){
        result.alreadyJoinRequest = true
        return result
    }

    if(project.participants.some(participant =>{ return participant.uuid === userId })){
        result.alreadyParticipant = true
        return result
    }

    if(project.joinFree){
        result.addedParticipants = true
        project.participants.push({uuid : userId, responsibilities : []})
    }else {
        result.addedJoinRequest = true
        project.joinRequests.push(userId)
    }
    result.success = true; 
    await project.save()
    return result 
}

const getOneProjectData = async (projectId) =>{

    let project = await db.project.findByUuidWithUserData(projectId); 

    return project
}



module.exports = {startNew, joinProject, editProjectData,getOneProjectData}