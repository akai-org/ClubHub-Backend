const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const {logRequestCall} = require('./utils/loger')
const {authenticate} = require('./middlewares/auth')
const {errorHandler} = require('./middlewares/errorHandler')

const userRouter = require('./routes/user')
const univeristyRouter = require('./routes/universityParam')

const errors = require('./utils/error/appError')
const validateRequest = require('./middlewares/validateRequestBody')
const {searchValidSchema} = require('./utils/validationJoiSchema')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logRequestCall)
app.use(authenticate)

app.get('/search', validateRequest(searchValidSchema), (req, res, next)=>{

})

app.use('/', userRouter);
app.use('/:university', univeristyRouter)

app.all('*', (req, res, next) => {
    next(new errors.NotFoundError( `This path ${req.originalUrl} isn't on this server!`))
})

app.use(errorHandler)

module.exports = app;