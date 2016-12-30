angular
.module('authctrl', ['ui.router', 'authService'])
.controller('AuthController', function($scope, $state, Authorize) {

	var self = this;
 	
 	Authorize.isLoggedIn().success(authCheck);
 	
 	function authCheck(response) {
		console.log(`${response.status}. Message: ${response.message}`);
		if(response.status == true) {
			$state.go('home.listusers');
		}
	}
	
	self.user = {
		username: "",
		password: ""
 	};

 	/*Send a login request using the authorize service*/
	self.login = function(){
		Authorize.login(self.user).success(authHandler);

		function authHandler(response) {
			console.log(response.message);
			if(response.status == true) {
				$state.go('home.listusers');
			}
			else {
				/*Propagate errors to the view.*/
			}
		};
	}

});