const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate} = require('./middlewares/auth')
const {errorHandler, logErrors} = require('./middlewares/errorHandler')

const AppError = require('./utils/appError')

const clubRouter = require("./routes/club")
const userRouter = require('./routes/user')
const projectRouter = require('./routes/project')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)
app.use(authenticate)

app.use('/club', clubRouter);
app.use('/u', userRouter);
app.use('/p', projectRouter);

app.all('*', (req, res, next) => {
    next(new AppError ( `This path ${req.originalUrl} isn't on this server!`, 404));
})

app.use(logErrors)
app.use(errorHandler)

module.exports = app;