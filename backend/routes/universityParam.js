const express = require('express')
//  /:university
univeristyParamRouter = express.Router({mergeParams: true})

const {authorize} = require('../middlewares/auth')
const validateRequest = require('../middlewares/validateRequestBody')
const {clubCreateValidSchema} = require('../utils/validationJoiSchema')

const clubRouter = require("./club")
const clubControlers = require('../controllers/club')


univeristyParamRouter.post('/club-create', 
    authorize('user'), 
    validateRequest(clubCreateValidSchema), 
    clubControlers.Create); 


univeristyParamRouter.use('/:clubname', 
    clubRouter);

module.exports = univeristyParamRouter