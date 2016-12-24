angular
.module('authService', [])
.factory('Authorize', function($http) {
	return {
		login : function(user) {
			console.log("In service" + user.toString());
			return $http.post("/auth/login", user);
		},
		isLoggedIn : function() {
			console.log("Status was checked");
			return $http.post("/auth/check");
		},
		logout : function() {
			return $http.post("/auth/logout");
		}
	};
});