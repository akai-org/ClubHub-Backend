const express = require('express')
//  /:university
univeristyParamRouter = express.Router({mergeParams: true})

const {authorize} = require('../middlewares/auth')
const {validateRequest} = require('../middlewares/validateRequestBody')
const {clubCreateValidSchema} = require('../utils/validationJoiSchema')

const clubRouter = require("./club")
const clubControler = require('../controllers/club')


univeristyParamRouter.post('/club-create', 
    authorize('user'), 
    validateRequest(clubCreateValidSchema), 
    clubControler.createClub); 


univeristyParamRouter.use('/:clubname', 
    clubRouter);

module.exports = univeristyParamRouter