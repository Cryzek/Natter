angular
.module('authctrl', ['ui.router', 'authService'])
.controller('AuthController', function($state, Authorize, $scope) {

 	Authorize
 		.isLoggedIn()
 		.success(function(response) {
 			console.log(`${response.status} with the message ${response.message}`);
 			if(response.status == true) {
 				$state.go('home');
 			}
 		});

	var self = this;

	self.user = {
		username: "",
		password: ""
 	};

 	/*Send a login request using the authorize service*/
	self.login = function(){
		Authorize
			.login(self.user)
			.success(function(response) {
				if(response.status == true) {
					console.log(response.message);
					$state.go('home');
				}
				else {
					console.log(response.message)
				}
			});
	}

});