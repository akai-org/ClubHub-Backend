const express = require('express')
const bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate, authorize} = require('./middlewares/auth')
const {register, login, profile} = require('./controllers/user')

const validateRequestBody = require('./middlewares/validateRequestBody')

const clubRouter = require("./routes/club")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)
app.use(authenticate)


app.use('/club', clubRouter);

//user related paths 
app.post('/register', validateRequestBody("email:username:password"), register);
app.get('/login', authorize('viewer:user'), validateRequestBody("email:password"), login);
app.get('/:username', profile);
app.get('/:test',authorize('admin:member'), async (req, res)=>{
    res.json({message: "test"})
});


module.exports = app;

/* 
czy powinno być potwoerdzenie maila?
podzielenie na użytkowników zweryfkiowanych i niezweryfikowanych 
na początek przeszukuje baze danych z zweryfikowanymi jeśli nie ma to sprawdza z niezweryfikowanymi i prosi o potwierdzenie maila w innym przypadku nie zaloguje na konto 

*/