const clubService = require('../services/club')
const httpStatusCode = require('../utils/httpStatusCodes')

exports.createJoinRequest = async (req, res, next) => {
    let params = req.params
    let user = req.user

    let result = await clubService.join(user.uuid, {name : params.clubname, university : params.university});    
    res.status(httpStatusCode.OK).json(result); 
}

exports.createClub = async (req, res, next) => {

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

    let result = await clubService.create(data); 
    res.status(httpStatusCode.OK).json(result); 
}

exports.getClubData = async (req, res, next) => {
    const {university, clubname} = req.params

    let clubInfo = await clubService.getClubProfileData(university, clubname);
    return res.status(httpStatusCode.OK).json({message:req.params.clubname, clubInfo});
}

exports.resolveJoinRequest = async (req, res, next) =>{
    const {uuid, accept} = req.body
    
    await clubService.resolveJoinRequest(uuid, accept, {university : req.params.university, name : req.params.clubname });
    res.status(httpStatusCode.OK).json({uuid : uuid, message : `request ${uuid} was ${accept ? '' : 'not '}accepted`})
}

exports.getJoinRequests = async (req, res, next) => {
    let params = req.params
    let joinRequestList = await clubService.getClubJoinRequests({university : params.university, name : params.clubname});
    res.status(httpStatusCode.OK).json({joinRequests : joinRequestList})
}