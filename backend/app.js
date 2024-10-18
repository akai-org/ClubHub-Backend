const express = require('express')
const app = express()
require('dotenv').config();

require('./utils/logger/instance')

const bodyParser = require('body-parser')

const {authenticate} = require('./middlewares/auth')
const {errorHandler} = require('./middlewares/errorHandler')

const userRouter = require('./routes/user')
const univeristyRouter = require('./routes/universityParam')

const errors = require('./utils/error/appError')
const validateRequest = require('./middlewares/validateRequestBody')
const {searchValidSchema} = require('./utils/validationJoiSchema')

const loggerMiddleware = require('./middlewares/logger')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(loggerMiddleware())

app.use(authenticate)

app.param( [ 'accountid', 'clubid'], (req, res, next, value, name)=>{
    // check if accunont or club id is valid 
    // user u123456
    // club c123456
    next(); 
})

app.get('/search', validateRequest(searchValidSchema), (req, res, next)=>{

})

app.use('/', userRouter);
app.use('/:university', univeristyRouter)

app.all('*', (req, res, next) => {
    next(new errors.NotFoundError( `This path ${req.originalUrl} isn't on this server!`))
})

app.use(errorHandler)

module.exports = app;