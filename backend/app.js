const express = require('express')
const bodyParser = require('body-parser')

const {log} = require('./utils/loger')
const {authenticate, authorize} = require('./middlewares/auth')
const {errorHandler, logErrors} = require('./middlewares/errorHandler')

const {register, login, profile} = require('./controllers/user')
const {newProject, joinProject, editProjectData, getProjects} = require('./controllers/project')

const AppError = require('./utils/appError')

const validateRequestBody = require('./middlewares/validateRequestBody')

const clubRouter = require("./routes/club")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(log)
app.use(authenticate)


app.use('/club', clubRouter);

app.post('/p/new', authorize('user'), validateRequestBody('name'), newProject)
app.post('/p/:projectId/join', authorize('user'), joinProject) //TO FIX
app.post('/p/:projectId/edit', authorize('projOwner'), editProjectData) // TO DO 
app.get('/p/getProjects', authorize('viewer'), getProjects) //TO DO, FILTERS?

app.post('/u/register', validateRequestBody("email:username:password"), register);
app.get('/u/login', authorize('viewer:user'), validateRequestBody("email:password"), login);
app.get('/u/:username', profile);

app.all('*', (req, res, next) => {
    next(new AppError ( `This path ${req.originalUrl} isn't on this server!`, 404));
})

app.use(logErrors)
app.use(errorHandler)

module.exports = app;

/* 
czy powinno być potwoerdzenie maila?
podzielenie na użytkowników zweryfkiowanych i niezweryfikowanych 
na początek przeszukuje baze danych z zweryfikowanymi jeśli nie ma to sprawdza z niezweryfikowanymi i prosi o potwierdzenie maila w innym przypadku nie zaloguje na konto 

*/