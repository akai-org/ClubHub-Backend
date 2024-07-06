const app = require("./app");
const {getCurrTime} = require('./utils/time');
const database = require('./repositories/mongoose/index');
const mongoose = require("mongoose");
require('dotenv').config()

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await database.connect();
    app.listen(PORT, () => {

        console.log(getCurrTime(), 'App running on port', PORT)
    })
}

process.on('exit', async (code) => {
    console.log(getCurrTime(),"Process exit with code :", code)

    if(process.env.NODE_ENV === 'development'){
        mongoose.connection.db.dropDatabase().then(()=>{
            console.log(getCurrTime(), "MongoDB database dropped")
        }).catch((error)=>{
            console.log(getCurrTime(), "Error while database dropping\n", error)
        })
    }
    mongoose.connection.close()
});

// Handle Ctrl+C interruption
process.on('SIGINT', (code) => {
    console.log(getCurrTime(), code)
    process.exit(0);
});

startServer()

