const app = require("./app");
const {getCurrTime} = require('./utils/time');
const database = require('./database/mongoose');

const PORT = 3000;

const startServer = async () => {
    await database.connect();

    app.listen(PORT, () => {

        console.log(getCurrTime(), 'App running on port', PORT)
    })
}

startServer()