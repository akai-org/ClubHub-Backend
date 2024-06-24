const express = require('express')
const bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate, authorize} = require('./middlewares/auth')
const {register, login, profile} = require('./controllers/user')

const {validateUserData} = require('./middlewares/user')

const clubRouter = require("./routes/club")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)
app.use(authenticate)


app.use('/club', clubRouter);

//user related paths 
app.post('/register', validateUserData, register);
app.get('/login', authorize('viewer:owner'), login);
app.get('/:username', profile);


module.exports = app;

/* 
czy powinno być potwoerdzenie maila?
podzielenie na użytkowników zweryfkiowanych i niezweryfikowanych 
na początek przeszukuje baze danych z zweryfikowanymi jeśli nie ma to sprawdza z niezweryfikowanymi i prosi o potwierdzenie maila w innym przypadku nie zaloguje na konto 

*/