/*
*
* Configuration properties
*/

// Create an enviroment object
var environment = {};

// Create a staging environment
environment.staging = {
	'httpPort': 3000,
	'envName': 'staging'
};

// Create a production enviroment
environment.production = {
	'httpPort': 5000,
	'envName': 'production'
};

// Determining the environment that has been passed through command line or configuration
var environmentPassed = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check whether the enviroment is present in the defined envs, else default to staging
var enviromentToExport = typeof(environment[environmentPassed]) == 'object' ? environment[environmentPassed] : environment.staging;

// Export the environment
module.exports = enviromentToExport;