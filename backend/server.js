const app = require("./app");
const database = require('./repositories/mongoose/index');
const config = require('./setup/config')
const logger = require('./utils/logger/instance')

const startServer = async () => {
    try{ 
        config.load(); 
        await database.connect();
        await logger.configure(config.get('logger'))
    }catch(err){ 
        logger.fatal(err.toString()); 
        process.exit(1); 
    }

    const PORT = config.get('app.port')

    app.listen(PORT, () => {
        logger.info(`App is running in ${process.env.NODE_ENV.toUpperCase()} enviroment`, { ...config.get(''),  node_enviroment : process.env.NODE_ENV })
    }).on('error', (err) => {
        logger.fatal(err.message); 
        process.exit(1); 
     });
}

startServer()