const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('./utils/logger/instance.js')

const db = require('./repositories/mongoose/index.js')
const {hash} = require('./utils/hash.js');
const { logger } = require('./utils/logger/instance.js');

const jestConsole = console

beforeAll(async () => {
  global.console = require('console');
  global.jestConsole = jestConsole; 
  global.mockData = require('./__test__/mockData.js')

  logger.info("NEW TEST BATCH"); 

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
  
  //setting mockData globally for use in all tests
  global.mockData = require('./__test__/mockData.js')
  await db.userRepo.model.deleteMany();
  await db.scienceClubRepo.model.deleteMany();

  await db.userRepo.model.insertMany([{
      ...mockData.user1,
      createdAt: Date.now(),
      password: `${await hash(mockData.user1.password)}` // Make sure this is a hashed password
    },
    {
    ...mockData.user2,
      createdAt: Date.now(),
      password: `${await hash(mockData.user2.password)}` // Make sure this is a hashed password
  }])

  await db.scienceClubRepo.model.create({
    ...mockData.club1,
    members: [ { uuid : mockData.user1.uuid, role : "test_role"}],
    joinrequests : []
  });

});
  
afterAll(async () => {
  await db.userRepo.model.deleteMany();
  await db.scienceClubRepo.model.deleteMany();

  await mongoose.disconnect();
  await mongoServer.stop();
  global.mockData = undefined; 
});


