angular
.module('mainctrl', ['ui.router', 'authService'])
.controller('MainController', function($state, Authorize) {
	var self = this;

	Authorize
		.isLoggedIn()
		.success(function(response) {
			if(response.status == false) {
				$state.go('userauth');
			}
		});

});