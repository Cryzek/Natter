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

	/*Get user information.*/
	UserDetails.getCurrentUser().success(loadUserInfo);
	function loadUserInfo(response) {
		self.user = response;
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