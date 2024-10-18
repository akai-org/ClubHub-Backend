const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const winston = require('winston');
const logger = require('./utils/logger');
require('winston-mongodb');


const jestConsole = console

beforeAll(async () => {
  global.console = require('console');
  global.jestConsole = jestConsole; 

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});

});
  
afterAll(async () => {
  global.console = jestConsole;
  global.jestConsole = undefined; 
  
  await mongoose.disconnect();
  await mongoServer.stop();

  //await logger.closeDBconnection(); 
});


