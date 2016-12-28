angular
.module('homectrl', ['ui.router', 'authService'])
.controller('HomeController', function($state, Authorize, $scope, $http) {
	
	Authorize
		.isLoggedIn()
		.success(function(response) {
			if(response.status == false) {
				$state.go('userauth');
			}
		});

	var self = this;
	/*Get user information.*/
	(function loadUserInfo() {
	})();

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
		Authorize.logout();
		$state.go('userauth');
	}
});