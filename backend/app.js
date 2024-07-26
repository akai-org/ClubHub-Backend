const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const {logRequestCall} = require('./utils/loger')
const {authenticate} = require('./middlewares/auth')
const {errorHandler} = require('./middlewares/errorHandler')

const clubRouter = require("./routes/club")
const userRouter = require('./routes/user')
const projectRouter = require('./routes/project')

const errors = require('./utils/appError')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(logRequestCall)
app.use(authenticate)

app.use('/club', clubRouter);
app.use('/', userRouter);
app.use('/p', projectRouter);

app.get('/testError', (req, res, next)=>{
    next(new errors.AlreadyInUseError("email : seweryn.wasilewski@gamil.com is alredy in use"));
})

app.all('*', (req, res, next) => {
    
    next(new errors.NotFoundError( `This path ${req.originalUrl} isn't on this server!`));
})

app.use(errorHandler)

module.exports = app;