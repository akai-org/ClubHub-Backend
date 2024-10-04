const clubService = require('../services/club')

const sendJoinRequest = async (req, res, next) => {
    let params = req.params
    let user = req.user

    let result
    try{
        result = await clubService.join(user.uuid, {name : params.clubname, university : params.university})
    }catch(error){
        return next(error)
    }
    
    res.status(200).json(result); 
}

const Create = async (req, res, next) => {

    const body = req.body
    let data = {
        uuid : 'c' + Date.now(), 
        name : body.name, 
        university : req.params.university, // VALIDATE IS UNIVERSITY IS IN DATABASE????????
        isopen : body.isopen, 
        description : body.description, 
        rules : body.rules,
        members : [{uuid : req.user.uuid , role : 'admin'}], 
        joinrequests : []
    }

    let result;
    try{
        result = await clubService.create(data); 
    }catch(error){
        return next(error)
    }

    res.status(200).json(result); 
}

const getClubProfile = async (req, res, next) => {

    const {university, clubname} = req.params

    let clubInfo;
    try{ 
        clubInfo = await clubService.getClubProfileData(university, clubname)
    }catch(err){
        return next(err)
    }
    return res.status(200).json({message:req.params.clubname, clubInfo});
}

const resolveJoinRequest = async (req, res, next) =>{
    const {uuid, accept} = req.body
    
    try {
        await clubService.resolveJoinRequest(uuid, accept, {university : req.params.university, name : req.params.clubname })
    }catch(error){
        return next(error)
    }

    res.status(200).json({uuid : uuid, message : `request ${uuid} was ${accept ? '' : 'not '}accepted`})
}

const getJoinRequests = async (req, res, next) => {
    let params = req.params
    let joinRequestList;
    try {
        joinRequestList = await clubService.getClubJoinRequests({university : params.university, name : params.clubname})
    }catch(error){
        return next(error)
    }
    res.status(200).json({joinRequests : joinRequestList})
}

module.exports = {
    sendJoinRequest, Create, getClubProfile, resolveJoinRequest, getJoinRequests
}