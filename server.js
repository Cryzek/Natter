var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = 8000;

app.use(express.static(__dirname + '/public/'));

io.on('connection', function(socket){
	console.log("A user has connected.");
});

/*Finally the port we are listening on*/
app.listen(PORT, function(){
	console.log(`Server started on port ${PORT}`);
});
