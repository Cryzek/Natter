angular
.module('homectrl', ['ui.router', 'authService', 'userService'])
.controller('HomeController', function($scope, $state, Authorize, UserDetails) {
	
	var self = this;
	self.user = {};

	/*Check if the user is logged in.*/
	Authorize.isLoggedIn().success(authCheck);
	function authCheck(response) {
		if(response.status == false) {
			$state.go('userauth');
		}
	}

	self.socket = io.connect();
	self.socket.on('new-user-connected', function(user) {
		Materialize.toast(`${user.username} has connected`, 1000);
	});

	/*Get user information.*/
	UserDetails.getCurrentUser().success(loadUserInfo);
	function loadUserInfo(response) {
		self.user = response;
		self.socket.emit('create-room', self.user);
	}

	/*Maintain navbar state.*/
	self.navbarOpen = false;
	self.toggleNavbar = function(action) {
		if(action == 'close') {
			self.navbarOpen = false;
			return ;
		}
		self.navbarOpen = !self.navbarOpen;
	}

	self.logout = function() {
		Authorize.logout().success(function() {
			$state.go('userauth');
		});
	}
});