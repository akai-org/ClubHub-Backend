const express = require('express')

var bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate} = require('./middlewares/auth')
const {register, login} = require('./controllers/user')

const {validateUserData} = require('./middlewares/user')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)

app.use(authenticate)


app.post('/register', validateUserData, register);

app.get('/login', login)

module.exports = app;

/* 
czy powinno być potwoerdzenie maila?
podzielenie na użytkowników zweryfkiowanych i niezweryfikowanych 
na początek przeszukuje baze danych z zweryfikowanymi jeśli nie ma to sprawdza z niezweryfikowanymi i prosi o potwierdzenie maila w innym przypadku nie zaloguje na konto 

*/