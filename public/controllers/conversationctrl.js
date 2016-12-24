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

	self.sendMessage = function() {
		console.log("Working on it.");
	};

});