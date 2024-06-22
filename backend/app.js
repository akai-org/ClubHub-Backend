const express = require('express')

var bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate} = require('./middlewares/auth')
const {register, login} = require('./controllers/user')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)

app.use(authenticate)

app.get('/login', login)
app.post('/register', register);

module.exports = app;