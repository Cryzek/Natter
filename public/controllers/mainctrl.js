angular
.module('mainctrl', ['ui.router', 'authService'])
.controller('MainController', function($state, Authorize, $http) {
	var self = this;
	
	self.user = {
		username: ""
	};

	Authorize
		.isLoggedIn()
		.success(function(response) {
			if(response.status == false) {
				$state.go('userauth');
			}
			else{
				$http.get('/user')
					.success(function(response) {
						self.user.username = response;
					});
			}
		});

});