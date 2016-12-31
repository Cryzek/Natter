/*Note: In javascript , primitives as passed by value, and objects are passed by reference.However, changing the object's reference will not affect the passed value.*/
module.exports = {
	init: _init
};

function _init(mongoose, DBURI) {
	/*Connect to database*/
	mongoose.connect(DBURI);

	/*When successfully connected*/
	mongoose.connection.on('connected', onconnect);
	
	/*If the connection throws an error*/
	mongoose.connection.on('error', onerror);

	/*When the connection is disconnected*/
	mongoose.connection.on('disconnected', ondisconnect);

	/*If the Node process ends, close the Mongoose connection*/
	process.on('SIGINT', () => { CtrlCHandler(mongoose); });
}

function onconnect() {
	console.log("Connected to database");
}

function onerror(error) {
	console.log(`Couldn't connect to database.\n Error : ${error}`);
}

function ondisconnect() {
	console.log("Disconnected from database");
}

function CtrlCHandler(mongoose) {
	mongoose.connection.close(function() {
		console.log("Mongoose connection closed through app termination.");
		process.exit(0);
	});
}