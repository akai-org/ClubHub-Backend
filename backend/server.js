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

/*
/config => configuration files 
/controllesrs => to handle the logic of diffrent routes 
/models => schema definition for example mongoose schemas 
/routes => routes definition for API 
/middleware => custom middleware functions 
/services => buisness logic and service functions service functions related to user operations 
/utils => utility functions and helpers 
/databse => databse classes and functions 
*/