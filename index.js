/*
* Primary file for the API
*
*/

// cDependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config')

// The server should respond to all requests with a string
var server = http.createServer(function(req,res) {

	// Get url and parse it
	var parsedUrl = url.parse(req.url, true);

	// Get the path
	var path = parsedUrl.pathname;
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the method
	var method = req.method.toLowerCase();

	// Get the headers
	var headers = req.headers;

	// Get query String Object
	var queryStringObject = parsedUrl.query;

	// Get payload if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data){
		buffer += decoder.write(data);
	});
	req.on('end', function(){
		buffer += decoder.end();
		
		// Choose the handler that the request goes to, if not found, return notFound handler
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to send as payload
		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'headers': headers,
			'method': method,
			'payload': buffer
		};

		chosenHandler(data, function(statusCode, payload){
			// Create a default for status code, send 200 if there is no status code received
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

			// Create a default for payload object, send an empty object if no payload is received
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload object to a string to send it back to user
			var payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the payload
			console.log('The payload with Stauts Code: ',statusCode, payloadString);

		});
	});
});



// The server should listen to port defined as per the environment
server.listen(config.httpPort,function(){
	console.log('This server is listening to port ' + config.httpPort + ' in the ' + config.envName + ' environment');
});


// Define the handlers

var handlers = {};

// Sample handler
handlers.sample = function(data, callback){
	// Callback with a http status code and a payload object
	callback(406, {'name' : 'sampleHandler'});
};

// Defining a hello handler for the homework assignment
handlers.hello = function(data, callback){
	// Call back with the http status code and a payload object that contains message
	var helloPayloadObject = {
		'name': 'helloHandler',
		'message': 'Message as a response for hello',
		'purpose': 'Node js homework assignment'
	};
	callback(408, helloPayloadObject);
};

// Not Found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Define a request router
var router = {
	'sample': handlers.sample,
	'hello': handlers.hello
};
