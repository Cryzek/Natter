angular
.module('conversationctrl', ['ui.router', 'authService', 'messageService', 'userService'])
.controller('ConversationController', function($scope, $stateParams, $state, Authorize, Messages, UserDetails) {

	var self = this;

	/*Check if the user is logged in.*/
	Authorize.isLoggedIn().success(authCheck);
	function authCheck(response) {
		if(response.status == false) {
			$state.go('userauth');
		}
	}

	self.message = "";
	self.sender = "";
	self.receiver = "" || $stateParams.receiverId;
	/*A nats element has structure: { message: '', sentByUser: true/false}*/
	self.nats = [];

	UserDetails.getCurrentUser().success(loadUserInfo);
	function loadUserInfo(response) {
		self.sender = response.username;
		/*To get the conversation between the two we need the sender and receiver names.*/
		Messages.getConversation(self.sender, self.receiver).success(loadMessages);
	}

	var socket = io.connect();

	function loadMessages(response) {
		/*Get conversation between the two.*/
		nats = response.map(function(item) {
			var nat = {
				message: item.message,
				sentByUser: (item.receiver == self.receiver),
				time: new Date(item.timeStamp).toUTCString()
			}
			return nat;
		});
		self.nats = nats;
		/*Create and join a personal room*/
		socket.emit('create-room', self.sender);
	}

	self.sendMessage = function() {	
		if(self.message != "") {
			Messages.sendMessage(self.sender, self.receiver, self.message, socket);
			socket.emit('send-message', self.message, self.receiver);
			var newNat = {
				message: self.message,
				sentByUser: true
			};
			self.nats.push(newNat);
			self.message = "";
		}
	}

	socket.on('receive-message', function(response) {
		var newNat = {
			message: response.message,
			sentByUser: false
		};
		self.nats.push(newNat);
	});
});