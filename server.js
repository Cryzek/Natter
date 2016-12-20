var express = require('express');
var bodyParser = require('body-parser');
/*The express application object.*/
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = 8000;

/*Applying the body-parser middleware*/
/*parse application/x-www-form-urlencoded*/
app.use(bodyParser.urlencoded({ extended: false }));

/*parse application/json*/
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public/'));

app.post('/auth/login', function(req, res) {
	var user = req.body;

	console.log(user);

	res.json({
		status: true,
		message: "Successfully logged in."
	});
});

/*Required. Cause unknown*/
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

/*Finally the port we are listening on*/
app.listen(PORT, function(){
	console.log(`Server started on port ${PORT}`);
});


/*
	Learning purposes
*/
/*	Doing it yourself. Parsing post data.	*/
/*var requestBody = "";
req.on('data', function(data) {
	requestBody += data;

	console.log(requestBody);
	res.json({
		status: true,
		message: "Successfully logged in."
	});
});*/