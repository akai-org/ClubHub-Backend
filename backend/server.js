const app = require("./app");
const {getCurrTime} = require('./utils/time');
const database = require('./repositories/mongoose/index');
const mongoose = require("mongoose");
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await database.connect();
    app.listen(PORT, () => {

        console.log('['+getCurrTime()+']', 'App running on port', PORT)
    })
}

startServer()

