angular
.module('userService', [])
.factory('UserDetails', function($http) {
	return {
		getCurrentUser: function() {
			return $http.get('/users/currentuser');
		},
		getAllUsers: function() {
			return $http.get('/users/all');
		},
		getUser: function(username) {
			return $http.get(`/users/userinfo/${username}`);
		}
	};
});