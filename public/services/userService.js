angular
.module('userService', [])
.factory('UserDetails', function($http) {
	return {
		getCurrentUser: function() {
			return $http.get('/users/currentuser');
		},
		getAllUsers: function() {
			return $http.get('/users/all');
		}
	};
});