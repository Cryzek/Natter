angular
.module('conversationctrl', ['ui.router', 'authService', 'messageService', 'userService'])
.controller('ConversationController', function($scope, $stateParams, $state, Authorize, Messages, UserDetails) {

	var self = this;
	var socket = io.connect();

	/*Check if the user is logged in.*/
	Authorize.isLoggedIn().success(authCheck);
	function authCheck(response) {
		if(response.status == false) {
			$state.go('userauth');
		}
	}

	self.message = "";
	self.sender = {};
	/*A nats element has structure: { message: '', sentByUser: true/false}*/
	self.nats = [];
	UserDetails.getCurrentUser().success(loadSenderInfo);
	function loadSenderInfo(response) {
		self.sender = response;
		/*To get the conversation between the two we need the sender and receiver names.*/
		Messages.getConversation(self.sender.username, self.receiver.username).success(loadMessages);
	}

	function loadMessages(response) {
		/*Get conversation between the two.*/
		nats = response.map(function(item) {
			var nat = {
				message: item.message,
				sentByUser: (item.receiver != self.sender.username),
				time: new Date(item.timeStamp).toUTCString()
			}
			return nat;
		});
		self.nats = nats;
		$("#messages-list").scrollTop(999999);
		/*Create and join a personal room*/
		socket.emit('create-room', self.sender);
	}

	self.receiver = {
		username: "" || $stateParams.receiverId
	};
	UserDetails.getUser(self.receiver.username).success(loadReceiverInfo);
	function loadReceiverInfo(response) {
		self.receiver = response;
	}

	/*Different event listeners.*/
	self.sendMessage = function() {	
		if(self.message != "") {
			Messages.sendMessage(self.sender.username, self.receiver.username, self.message, socket);
			socket.emit('send-message', self.message, self.receiver);
			var newNat = {
				message: self.message,
				sentByUser: true
			};
			self.nats.push(newNat);
			$("#messages-list").scrollTop(999999);
			self.message = "";
		}
	}

	socket.on('receive-message', function(response) {
		var newNat = {
			message: response.message,
			sentByUser: false
		};
		$scope.$apply( () => { 
			self.nats.push(newNat); 
			$("#messages-list").scrollTop(999999);
		});
		Materialize.toast("New message received", 1000);
	});
});