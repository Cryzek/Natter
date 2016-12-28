angular
.module('conversationctrl', ['ui.router', 'authService', 'messageService'])
.controller('ConversationController', function($state, Authorize, Messages, $scope) {

	Authorize
		.isLoggedIn()
		.success(function(response) {
			if(response.status == false) {
				$state.go('userauth');
			}
		});

	var self = this;
	self.message = "";
	self.sender = $scope.$parent.$parent.main.user.username;
	self.receiver = self.sender == "Gryk"?"Cryzek":"Gryk";
	/*A nats element has structure: { message: '', sentByUser: true/false}*/
	self.nats = [];

	$("#messages-list").scrollTop(999999);

	(function getMessages() {
		/*Get conversation between the two.*/
		Messages.getConversation(self.sender, self.receiver)
			.success(function(response) {
				nats = response.map(function(item) {
					var nat = {
						message: item.message,
						sentByUser: (item.receiver == self.receiver),
						time: new Date(item.timeStamp).toUTCString()
					}
					return nat;
				});
				console.log(nats);
				self.nats = nats;
				$("#messages-list").scrollTop(999999);
			});
	})();

	var socket = io.connect();
	/*Create and join a personal room*/
	socket.emit('create-room', self.sender);

	self.sendMessage = function() {	
		if(self.message != "") {
			Messages.sendMessage(self.sender, self.receiver, self.message, socket);
			socket.emit('send-message', self.message);
			var newNat = {};
			newNat.message = self.message;
			newNat.sentByUser = true;
			self.nats.push(newNat);
			self.message = "";
			$("#messages-list").scrollTop(999999);
		}
	};

	socket.on('receive-message', function(response, senderid) {
		var newNat = {};
		newNat.message = response.message;
		newNat.sentByUser = false;
		self.nats.push(newNat);
		$("#messages-list").scrollTop(999999);
	});

});