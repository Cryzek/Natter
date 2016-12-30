/*Note: In javascript , primitives as passed by value, and objects are passed by reference.However, changing the object's reference will not affect the passed value.*/
module.exports = {
	init: _init
};

function _init(mongoose, DBPATH, DBNAME) {
	let DBURI = `${DBPATH}/${DBNAME}`;
	
	/*Connect to database*/
	mongoose.connect(DBURI, onconnect, onerror);

	mongoose.connection.on('disconnect', ondisconnect);

	/*If the Node process ends, close the Mongoose connection*/
	process.on('SIGINT', () => { CtrlCHandler(mongoose); });
}

/*When successfully connected*/
function onconnect() {
	console.log("Connected to database");
}

/*If the connection throws an error*/
function onerror(error) {
	console.log(`Couldn't connect to database.\n Error : ${error}`);
}

/*When the connection is disconnected*/
function ondisconnect() {
	console.log("Disconnected from database");
}

function CtrlCHandler(mongoose) {
	mongoose.connection.close(function() {
		console.log("Mongoose connection closed through app termination.");
		process.exit(0);
	});
}