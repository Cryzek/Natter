angular
.module('conversationctrl', ['ui.router', 'authService'])
.controller('ConversationController', function($state, Authorize) {

	Authorize
		.isLoggedIn()
		.success(function(response) {
			if(response.status == false) {
				$state.go('userauth');
			}
		});

	var self = this;
	self.message = "";
	self.nats = [];

	$("#messages-list").scrollTop(999999);

	var socket = io.connect();

	self.sendMessage = function() {	
		if(self.message != "") {
			socket.emit('message', self.message);
			self.message = "";
		}
	};

	socket.on('serveralert', function(response) {
		alert(response.message);
	});

});