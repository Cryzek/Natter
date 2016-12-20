angular
.module('authctrl', ['ui.router', 'authService'])
.controller('AuthController', function($state, Authorize, $scope) {

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
				if(response.status) {
					console.log(response.message);
					$scope.$parent.main.isLoggedIn = true;
					$state.go('home');
				}
			});
	}

});