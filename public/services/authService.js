angular
.module('authService', [])
.factory('Authorize', function($http) {
	return {
		login : function(user) {
			return $http.post("/auth/login", user);
		},
		isLoggedIn : function() {
			return $http.post("/auth/check");
		},
		logout : function() {
			return $http.post("/auth/logout");
		}
	};
});