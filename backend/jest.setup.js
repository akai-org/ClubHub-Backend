const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('./utils/logger/instance.js');

const db = require('./repositories/mongoose/index.js');
const { hash } = require('./utils/hash.js');
const logger = require('./utils/logger/instance.js');
const config = require('./setup/config');

const jestConsole = console;
let mongoServer; // Declare globally to reuse it

beforeAll(async () => {
   logger.verbose("Starting Jest setup...");

  const startTotal = Date.now(); // Track total setup time
  config.load();
  
  global.console = require('console');
  global.jestConsole = jestConsole;
  global.mockData = require('./__test__/mockData.js');

  logger.info("NEW TEST BATCH");

  // Start MongoMemoryServer before tests
  if (!mongoServer) {
    const startMongo = Date.now();
    mongoServer = await MongoMemoryServer.create();
     logger.verbose("MongoMemoryServer started in", Date.now() - startMongo, "ms");
  }

  const uri = mongoServer.getUri();

  // Connect to in-memory MongoDB
  const startDB = Date.now();
  await mongoose.connect(uri, {});
  logger.verbose("Connected to MongoDB in", Date.now() - startDB, "ms");

  global.mockData = require('./__test__/mockData.js');

  // Clear existing data
  await db.userRepo.model.deleteMany();
  await db.scienceClubRepo.model.deleteMany();

  // Use lower bcrypt cost for faster tests
  const startHash = Date.now();
  const hashedPassword1 = await hash(mockData.user1.password, 5);
  const hashedPassword2 = await hash(mockData.user2.password, 5);
  logger.verbose("Password hashing took", Date.now() - startHash, "ms");

  // Insert test data
  await db.userRepo.model.insertMany([
    { ...mockData.user1, createdAt: Date.now(), password: hashedPassword1 },
    { ...mockData.user2, createdAt: Date.now(), password: hashedPassword2 }
  ]);

  await db.scienceClubRepo.model.create({
    ...mockData.club1,
    members: [{ uuid: mockData.user1.uuid, role: "test_role" }],
    joinrequests: []
  });

   logger.verbose("Jest setup completed in", Date.now() - startTotal, "ms");
}, 10000);

afterAll(async () => {
  logger.verbose("Cleaning up Jest test environment...");

  await db.userRepo.model.deleteMany();
  await db.scienceClubRepo.model.deleteMany();

  await mongoose.disconnect();
  await mongoServer.stop();
  global.mockData = undefined;

   logger.verbose("Test cleanup completed.");
}, 10000);
