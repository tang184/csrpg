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
var mysql = require('mysql');
// create a new express server
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var db_config = {
	host: 'us-cdbr-iron-east-04.cleardb.net',
	user: 'b1741feb7c0982',
	password: '469100d6',
	database: 'ad_18cfb6c1d43882b'
};

var connection;


function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


app.use(bodyParser());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.get('/game', function(req, resp){
	resp.sendfile('public/game1.html');
});

app.get('/game2', function(req, resp){
	resp.sendfile('https://yakume.xyz/game');
});

app.post('/submitscore', function(req, resp){
	/*var post  = {user: "hi" , score: req.body.score};
	var query = connection.query('INSERT INTO test SET ?', post, function(err, result) {
		if (!!err) {
			resp.send("Submit score error");
		}
	})*/
	resp.redirect('/game2');
});


app.post('/login', function(req, resp){

	//resp.sendfile('public/index.html');
	//resp.end();
	//resp.end(JSON.stringify(req.body));
	connection.query("SELECT * FROM test", function(err, rows, fields) {
		if (!!err) {
			console.log("error in the query");
		} else {
			console.log(rows);
			var find = false;
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].user == req.body.username && rows[i].password == req.body.password) {
					find = true;
				}
			}
			if (find) {
				resp.redirect('/game');
			} else {
				resp.send("username and password not match");
			}
			
		}
	});
});

app.post('/signup', function(req, resp) {
	var find = false;
	connection.query("SELECT user FROM test", function(err, rows, fields) {
		if (!!err) {
			console.log("error in the query");
		} else {
			console.log(rows);
			for (var i = 0; i < rows.length; i++) {
				console.log(rows[i].user);
				console.log(req.body.username);
				if (rows[i].user == req.body.username) {
					find = true;
				}
			}
			if (!find) {
				var post  = {user: req.body.username , password: req.body.password};
				var query = connection.query('INSERT INTO test SET ?', post, function(err, result) {
					if (!!err) {
						resp.send("username already exist, find a new username");
					}
				})
				resp.redirect('/');
			} else {
				resp.send("username already exist, find a new username");
			}
			
		}
	});
	
	
})

app.get('/', function(req, resp){
	resp.sendfile('public/index.html');
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
