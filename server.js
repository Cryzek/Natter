/*Load environment variables*/
require('dotenv').config();

/*
	Importing different modules
*/
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');


/*
	Declaring our variables
*/
/*The express application object.*/
var app = express();
/*Http server*/
var server = http.Server(app);
/*Socket io for bidirectional communication*/
var io = socketio(server);
/*Port on which the process will run/receive requests*/
var PORT = process.env.PORT || 10000;


/*
	Setting up different middlewares
*/
/*Setting up cookie and session data*/
app.use(cookieParser("itsnosecret") ) ;
app.use(expressSession() );
/*Applying the body-parser middleware to append post data to req as req.body*/
/*parse application/x-www-form-urlencoded*/
app.use(bodyParser.urlencoded({ extended: false }) );
/*parse application/json*/
app.use(bodyParser.json() );
/*Serving the directory containing index.html*/
app.use(express.static(__dirname + '/public/') );


/*
	Different routes
*/
app.post('/auth/login', function(req, res) {
	var user = req.body;
	
	if(! (user.usename != "" && user.password != "") ) {
		console.log("Empty fields. SOS. We have been hacked.");
		res.send({
			status : false,
			message : "Cannot authenticate"
		});
	}

	/*Already logged in users are not checked here.*/
	req.session.user_id = user.username;
	console.log(`User logged with session id - ${req.session.user_id}`);
	res.json({
		status: true,
		message: "Successfully logged in."
	});
});

app.post('/auth/logout', function(req, res) {
	delete req.session.user_id;
	res.redirect('login');
});

app.post('/auth/check', function(req, res) {
	if(req.session.user_id) {
		res.json({
			status: true
		});
	}
	else {
		res.json({
			status: false
		});
	}
});

/*Required. Cause unknown*/
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

/*Finally the port we are listening on*/
app.listen(PORT, function() {
	console.log(`Server started on port ${PORT}`);
});