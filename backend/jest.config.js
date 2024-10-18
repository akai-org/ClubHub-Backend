module.exports = {
  testEnvironment: 'node', // Use the Node.js environment for testing
  roots: ['<rootDir>'], // Specify directories to search for tests
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['./jest.setup.js'], // Path to your global setup file
  displayName: {
    name: 'CLUB HUB',
    color: 'blue',
  },
  verbose: true,
  reporters: ['default'],
  };