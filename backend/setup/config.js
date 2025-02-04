const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const {ConfigurationError} = require('../utils/error/appError')
const assert = require('assert');

/**
 * Deeply merges two objects, with properties from the source object overwriting 
 * properties in the target object. Recursively merges nested objects.
 * 
 * @param {Object} target - The target object to be merged into.
 * @param {Object} source - The source object whose properties will overwrite those in the target.
 * @returns {Object} The merged object.
 */
function deepMerge(target, source) {
  for (const key in source) {
    // If the source property is an object and the target also has an object at the same key
    if (typeof source[key] === 'object' && source[key] !== null && target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], source[key]); // Recurse for nested objects
    } else {
      target[key] = source[key]; // Otherwise, overwrite the target property
    }
  }
  return target;
}

let config = {}; 

/**
 * Loads and merges configuration from default.json, config.json, and environment variables.
 * Ensures all required environment variables are set.
 */
exports.load = () => {
  dotenv.config();  
  const logger = require('../utils/logger/instance')

  let defaultConfig = {};
  try {
    defaultConfig = require('./../config/default.json');
  } catch (err) {
    console.error('Failed to load default.json');
    process.exit(1);
  }

  let customConfig = {};
  const configPath = path.resolve(__dirname, './../config/config.json');
  try {
    
    if (fs.existsSync(configPath)) {
      customConfig = require('./../config/config.json');
    }else{
      console.log("config.js doesnt exists")
    }
  } catch (err) {
    console.error('Failed to load config.json');
    process.exit(1);
  }

  config = deepMerge(defaultConfig, customConfig);

  function resolvePlaceholders(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        resolvePlaceholders(obj[key]);
        continue; 
      }

      if (typeof obj[key] === 'string' && obj[key].startsWith('${') && obj[key].endsWith('}')) {
        const envVar = obj[key].slice(2, -1); // Extract the variable name, e.g., PORT
        if (!process.env[envVar]) {
          throw new ConfigurationError(`Missing required environment variable: ${envVar}`);
          process.exit(1); // Exit the app if the variable is missing
        }
        obj[key] = process.env[envVar]; // Replace placeholder with the env variable's value
      }
    }
  }

  resolvePlaceholders(config);
  logger.verbose("config", {...config}); 
  logger.verbose("Configuration loaded successfully")
}

/**
 * Retrieves a configuration value.
 * @param {string} key - The config key (e.g., "app.port")
 * @returns {*} The corresponding config value
 */
exports.get = (key) => {

  assert(typeof key === 'string', 'Key must be a string');

  if (key === '') {
    return config;
  }

  const keys = key.split('.'); // Split key by dot notation to handle nested keys
  let result = config;
  for (const keyPart of keys) {
    result = result[keyPart];
    if (result === undefined) {
      return undefined; // Return undefined if any part of the key path is not found
    }
  }
  return result;
}