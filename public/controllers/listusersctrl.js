angular
.module('listusersctrl', ['userService'])
.controller('ListUsersController', function(UserDetails) {
	var self = this;

	/*Well, no need to check for authenticated user.(Since, already checked by homectrl)*/
	self.userlist= [];

	UserDetails.getAllUsers().success(loadAllUsers);

	function loadAllUsers(response) {
		self.userlist = response;

	}
});