const express = require('express');

const userController= require('../controllers/user')
const {validateRequest} = require('../middlewares/validateRequestBody')
const {loginValidSchema, registerValidSchema, userValidSchema} = require('../utils/validationJoiSchema')
// /account/:uuid
const accountRouter = express.Router({mergeParams: true}); 

// account Router: /account/:uuid
accountRouter.get('/', userController.getUserData)

accountRouter.patch('/',
    validateRequest(userValidSchema),
    userController.updateUser)

// /
const userRouter = express.Router();

// user Router: /
userRouter.post('/register', 
    validateRequest(registerValidSchema), 
    userController.registerUser);

userRouter.post('/login', 
    validateRequest(loginValidSchema), 
    userController.loginUser);

userRouter.use('/account/:uuid', 
    accountRouter)

module.exports = userRouter;
