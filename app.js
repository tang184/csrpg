/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');

app.use(bodyParser());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get('/game', function(req, resp){
	resp.sendfile('public/game1.html');
});


app.post('/login', function(req, resp){

	//resp.sendfile('public/index.html');
	//resp.end();
	//resp.end(JSON.stringify(req.body));

	if (req.body.username=="abc") {
		resp.redirect('/game');
	} else {
		resp.sendfile('public/index.html');
	}
});

app.post('/', function(req, resp){

		resp.sendfile('public/index.html');
});


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
