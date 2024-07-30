const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const {logRequestCall} = require('./utils/loger')
const {authenticate, authorize} = require('./middlewares/auth')
const {errorHandler} = require('./middlewares/errorHandler')

const club = require('./controllers/club')
const validateRequestBody = require('./middlewares/validateRequestBody')

const clubRouter = require("./routes/club")
const userRouter = require('./routes/user')
const projectRouter = require('./routes/project')

const errors = require('./utils/appError')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logRequestCall)
app.use(authenticate)

app.use('/:university/:clubname', clubRouter);

app.post('/:university/club-create', authorize('user'),  validateRequestBody("name:university:description"), club.Create); //to do validate request body
app.get('/club/search', (req, res)=>{
    res.status(200).json({message : "to do club search"})
})
app.delete('/club/delete', (req, res)=>{
    res.status(200).json({message : "to do club delete"})
})

app.use('/', userRouter);
app.use('/p', projectRouter);




app.get('/error-test/:error', (req, res, next)=>{
    next(new errors[req.params.error]("this is test error"));
})

app.all('*', (req, res, next) => {
    
    next(new errors.NotFoundError( `This path ${req.originalUrl} isn't on this server!`));
})

app.use(errorHandler)

module.exports = app;