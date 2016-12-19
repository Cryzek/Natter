var natterApp = angular
.module('Natter',[
					'ui.router',
					'mainctrl'
					]);

natterApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	
	/*Turn on html 5 mode for angular*/
	$locationProvider.html5Mode(true);


	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "pages/home.html" 
		})
		.state('userAuth', {
		  	url: "userauth",
		  	templateUrl: "pages/userauth.html"
		});


});