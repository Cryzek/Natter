var http = require('http');
var express = require('express');

/*The express application to handle it all.*/
var app = express();

app.get('/',function(req, res){
	console.log("New Client connected");
});

app.listen(8000);
