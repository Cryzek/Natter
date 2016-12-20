angular
.module('homectrl', [])
.controller('HomeController', function() {
	$('button-collapse').sideNav();

	var self = this;

	self.navbarOpen = false;

	self.toggleNavbar = function(action){
		if(action == 'close'){
			self.navbarOpen = false;
			return ;
		}
		self.navbarOpen = !self.navbarOpen;
	}

	
	
});