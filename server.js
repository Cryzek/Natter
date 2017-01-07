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
var DBINIT = require('./dbinit');

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
	Modules with dependencies
*/
var authRouter = require('./serverroutes/authroute')(express);
var messageRouter = require('./serverroutes/messageroute')(express, io);
var userInfoRouter = require('./serverroutes/userinforoute')(express);

/*
	Connecting to mongoose;
*/
DBINIT.init(mongoose, process.env.LOCALDBURI);

/*
	Setting up different middlewares
*/
/*Setting up sessions*/
app.use(expressSession({
	secret: "itsnosecret",
	cookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: 60 * MIN // 1 hour
	},
	unset: 'destroy',
	store: new mongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 5 * 60 * 60 // 5 hours
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
/*Authentication*/
app.use('/auth', authRouter.Router);	
/*Transfer and storing of messages*/
app.use('/messages', messageRouter.Router);
/*User/s related information*/
app.use('/users/', userInfoRouter.Router);

/*Required. Cause unknown*/
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {

	socket.on('create-room', function(sender) {
		// console.log(sender);
		socket.join(sender.username);
		socket.broadcast.emit('new-user-connected', sender);
	});

	socket.on('send-message', function(message, receiverId) {
		if(receiverId) {
			socket.to(receiverId).emit('receive-message', {
				message: message
			});
		}
	});

});

/*Finally the port we are listening on*/
server.listen(PORT, function() {
	console.log(`Server running on ${PORT}`);
});