const express = require('express');
const userRouter = express.Router();
const accountRouter = express.Router({mergeParams: true}); 

const {register, login , accountData} = require('../controllers/user')
const validateRequestBody = require('../middlewares/validateRequestBody')
const {authorize} = require('../middlewares/auth')

userRouter.post('/register', validateRequestBody("email:username:password"), register);
userRouter.get('/login', validateRequestBody("email:password"), login);

// /account/:uuid
accountRouter.get('/', accountData)

accountRouter.get('/event', (req, res)=>{
    res.status(200).json({message : 'to do account events'})
})

accountRouter.get('/meet', (req, res)=>{
    res.status(200).json({message : 'to do account meetings'})
})

accountRouter.get('/project', (req, res)=>{
    res.status(200).json({message : 'to do account projects'})
})

accountRouter.get('/club', (req, res)=>{
    res.status(200).json({message : 'to do account clubs'})
})

accountRouter.put('/edit', (req, res)=>{

})

userRouter.use('/account/:uuid', accountRouter)

module.exports = userRouter;
