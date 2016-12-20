angular
.module('mainctrl', ['ui.router'])
.controller('MainController', function($state) {
	var self = this;

	/*Whether the user is logged in or not*/
	self.isLoggedIn = true;

	window.setTimeout(function(){
		if( self.isLoggedIn == false) {
			$state.go('userauth');
		}
	}, 1000);



});