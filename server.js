/*Load environment variables*/
require('dotenv').config();

/*
	Importing different modules
*/
var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(expressSession);

/*
	Declaring our variables
*/
/*The express application object.*/
var app = express();
/*Http server*/
var server = http.createServer(app);
/*Socket io for bidirectional communication*/
var io = socketio.listen(server);
/*Port on which the process will run/receive requests*/
var PORT = process.env.PORT || 10000;
var MIN = 60 * 1000;

/*
	Connecting to mongoose;
*/
mongoose.connect(process.env.DBURI);

/*Modules with dependencies*/
var authRouter = require('./serverroutes/authroute')(express, io);
var messageRouter = require('./serverroutes/messageroute')(express, io);

/*Connection events on mongoose*/
/*When successfully connected*/
mongoose.connection.on('connected', function() {
	console.log("Connected to natter database");
});

/*If the connection throws an error*/
mongoose.connection.on('error', function(error) {
	console.log(`Couldn't connect to database.\n Error : ${error}`);
});

/*When the connection is disconnected*/
mongoose.connection.on('disconnect', function() {
	console.log("Disconnected from database");
});

/*If the Node process ends, close the Mongoose connection*/
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log("Mongoose connection closed through app termination.");
		process.exit(0);
	});
});

/*
	Setting up different middlewares
*/
/*Setting up sessions*/
app.use(expressSession({
	secret: "itsnosecret",
	duration: 20 * MIN,
	activeDuration: 10*MIN,
	unset: 'destroy',
	store: new mongoStore({
		mongooseConnection: mongoose.connection
	})
}) );
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
app.use('/auth', authRouter.Router);	
app.use('/messages', messageRouter.Router);
app.use('/user', function(req, res, next) {
	if(req.session.user_id) {
		res.send(req.session.user_id);	
	}
	else {
		res.send(404, "Error");
	}
});

/*Required. Cause unknown*/
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {

	socket.on('create-room', function(username) {
		socket.join(username);
	});

	socket.on('send-message', function(message, userid) {
		if(userid) {
			socket.to(userid).emit('receive-message', "");
		}
		// socket.broadcast.emit('receive-message', { "message": message}, socket.id);
	});

});

/*Finally the port we are listening on*/
server.listen(PORT, function() {
	console.log(`Server running on ${PORT}`);
});