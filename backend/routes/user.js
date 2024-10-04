const express = require('express');

const {register, login , accountData} = require('../controllers/user')
const validateRequest = require('../middlewares/validateRequestBody')
const {loginValidSchema, registerValidSchema} = require('../utils/validationJoiSchema')


// /account/:uuid
const accountRouter = express.Router({mergeParams: true}); 

// account Router: /account/:uuid
accountRouter.get('/', accountData)

// /
const userRouter = express.Router();

// user Router: /
userRouter.post('/register', 
    validateRequest(registerValidSchema), 
    register);

userRouter.post('/login', 
    validateRequest(loginValidSchema), 
    login);

userRouter.use('/account/:uuid', 
    accountRouter)

module.exports = userRouter;
