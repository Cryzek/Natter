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
var authRouter = require('./serverroutes/authroute')(express);
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

/*
	Connecting to mongoose;
*/
mongoose.connect(process.env.DBURI);

/*CONNECTION EVENTS*/
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
/*Setting up cookie and session data*/
app.use(cookieParser("itsnosecret") ) ;
app.use(expressSession({
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

/*Required. Cause unknown*/
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(clientsocket) {
	clientsocket.on('message', function(message) {
		console.log(message);
		clientsocket.emit('serveralert', { "message": `Message : ${message} ; received`});
	});

	console.log("Successfully connected");
});

/*Finally the port we are listening on*/
server.listen(PORT, function() {
	console.log(`Server running on ${PORT}`);
});