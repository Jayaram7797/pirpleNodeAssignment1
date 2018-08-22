/*
 * This is to create the "Hello World" API
 * This will be implemented both on http and https servers
 * Will be using more functions than the requirement of the assignment so that I can practice the features I am learning.
 */

var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');


//INSTANTIATE HTTP SERVER
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

//STARTING THE HTTP SERVER
httpServer.listen(3000, function(){
	console.log("HTTP SERVER IS RUNNING ON PORT 3000");
});

//DEFINING THE HTTPSSERVEROPTIONS
var httpsServerOptions = {
	'key':fs.readFileSync('./https/key.pem'),
	'cert':fs.readFileSync('./https/cert.pem')
};

//INSTANTIATE THE HTTPS SERVER
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

//STARTING HTTPS SERVER
httpsServer.listen(3001, function(){
	console.log("HTTPS SERVER IS RUNNING ON PORT 3001")
});

//UNIFIED SERVER FUNCTION TO HANDLE BOTH THE HTTP AND HTTPS REQUESTS
var unifiedServer = function(req, res){

	//PARSE THE URL
	var parsedUrl = url.parse(req.url, true);

	//GET THE PATH FROM THE URL
	var path = parsedUrl.pathname;

	//GET THE TRIMMED PATH TO REMOVE SLASHES IN THE BEGINING AND END OF URL
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	//GET THE QUERYSTRING OBJECT
	var queryStringObject = parsedUrl.query;

	//GET THE METHOD OF API CALL 
	var method = req.method;

	//GET THE HEADERS OF THE API CALL
	var headers = req.headers;

	//CONSTRUCTING THE DATA OBJECT TO BE PASSED AS THE PARAMETER TO THE CHOSEN HANDLER
	var data = {
		'trimmedPath' : trimmedPath,
		'queryStringObject' : queryStringObject,
		'method' : method,
		'headers' : headers //excluding the payload
	};

	//SELECT THE HANDLER TO RESPOND TO THE API CALL BASED ON THE TRIMMEDPATH
	var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;


	chosenHandler(data, function(statusCode, payload){
		//DEFAULTING THE STATUS CODE TO 200 IN CASE OF INVALID STATUS CODE
		statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

		//DEFAULTING THE PAYLOAD TO AN EMPTY OBJECT IN CASE OF AN INVALID PAYLOAD
		payload = typeof(payload) == 'object' ? payload : {};


		//STRINGIFYING THE PAYLOAD 
		payload = JSON.stringify(payload);

		//NOW THAT WE HAVE BOTH THE STATUS CODE AND THE PAYLOAD WE WILL BEGIN TO SEND RESPONSE

		res.writeHead(statusCode, {'Content-Type' : 'application/json'});
		res.write(payload);
		res.end();


		console.log("\nRESPONDING BACK WITH THE PAYLOAD : "+payload+"\n");
	});


};

//INSTANTIATING THE HANDLERS OBJECT
var handlers = {};

handlers.hello = function(data, callback){
	callback(200, {'hello':'HELLO THIS IS JAYARAM PEMMANABOYIDI. I AM ENJOYING THE NODE JS MASTER CLASS.'});
};

handlers.notFound = function(data, callback){
	callback(404, {'sorry':'REQUESTED PAGE NOT FOUND'});
}


//THE ROUTER OBJECT THAT DEFINES THE HANDLERS
var router = {
	'hello' : handlers.hello
};