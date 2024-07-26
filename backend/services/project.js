const db = require('../repositories/mongoose/index');
const errors = require('../utils/appError')


const startNew = async (projectData) =>{
    projectData.uuid = Date.now(); //need to change to create some proper uuid

    let project = await db.projectRepo.insert(projectData)
    
    const { _id, participants,joinRequests , __v ,...resultproject} = project
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

    let project = await db.projectRepo.findByUuid(projectId)
    let user = await db.userRepo.FindByUuid(userId)

    result.correct.projectId = project ? true : false; 
    result.correct.userId = user ? true : false;  

    if(!project || !user){
        console.log("no user or project")
        throw new errors.NotFoundError("Project or User was not found")
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
        db.projectRepo.addParticipant(projectId, userId)
    }else {
        result.addedJoinRequest = true
        db.projectRepo.addJoinRequest(projectId, userId)
    }
    result.success = true; 
    return result 
}

const getOneProjectData = async (projectId) =>{

    let project = await db.projectRepo.findByUuidWithUserData(projectId); 

    if(!project){
        throw new errors.NotFoundError(`Project with uuid : ${projectId} was not found`)
    }

    return project
}



module.exports = {startNew, joinProject, editProjectData,getOneProjectData}