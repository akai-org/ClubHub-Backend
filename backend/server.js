const app = require("./app");
const database = require('./repositories/mongoose/index');
const config = require('config')
require('./utils/logger/instance')

const PORT = config.get('app.port') || 3000;

const startServer = async () => {
    await database.connect();
    app.listen(PORT, () => {
        logger.verbose(`App is running in ${process.env.NODE_ENV.toUpperCase()} enviroment`, { ...config,  node_enviroment : process.env.NODE_ENV })
    }).on('error', (err) => {
        logger.fatal(err.message); 
        process.exit(1); 
     });
}

startServer()