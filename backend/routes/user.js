const express = require('express');
const userRouter = express.Router();

const {register, login , profile} = require('../controllers/user')
const validateRequestBody = require('../middlewares/validateRequestBody')
const {authorize} = require('../middlewares/auth')

userRouter.post('/register', validateRequestBody("email:username:password"), register);
userRouter.get('/login', authorize('viewer:user'), validateRequestBody("email:password"), login);
userRouter.get('/:username', profile);

module.exports = userRouter;
