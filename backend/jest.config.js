const config = require('./setup/config')
config.load()

module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ["<rootDir>/__test__/manual.test.js"],
  roots: ['<rootDir>/__test__'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  displayName: {
    name: 'CLUB HUB',
    color: 'blue',
  },
  noStackTrace: false, 
  detectOpenHandles: true, 
  verbose: true, 
  reporters: ['default'],
  
  };