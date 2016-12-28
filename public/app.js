var natterApp = angular.module('Natter',[
										'ui.router',
										'ngAnimate',
										'authService',
										'messageService',
										'mainctrl',
										'authctrl',
										'homectrl',
										'conversationctrl'
										]);

natterApp.config(setupConfig);

function setupConfig($stateProvider, $urlRouterProvider, $locationProvider) {
	
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "pages/home.html",
			controller: "HomeController",
			controllerAs: "vm"
		})
		.state('userauth', {
		  	url: "/userauth",
		  	templateUrl: "pages/userauth.html",
		  	controller: "AuthController",
		  	controllerAs: "vm"
		})
		.state('home.listusers', {
			url: "listusers",
			templateUrl: "pages/listusers.html"
		})
		.state('home.listgroups', {
			url: "listgroups",
			templateUrl: "pages/listgroups.html"
		})
		.state('home.converse', {
			url: "natter/:userid",
			templateUrl: "pages/conversation.html",
			controller: "ConversationController",
			controllerAs: "vm"
		});


	$urlRouterProvider.otherwise('/');

}