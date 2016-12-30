var natterApp = angular.module('Natter',[
										'ui.router',
										'ngAnimate',
										'authService',
										'messageService',
										'userService',
										'mainctrl',
										'authctrl',
										'homectrl',
										'listusersctrl',
										'conversationctrl'
										]);

natterApp.config(setupConfig);

function setupConfig($stateProvider, $urlRouterProvider, $locationProvider) {
	
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('home', {
			url: "/home",
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
			url: "/listusers",
			templateUrl: "pages/listusers.html",
			controller: "ListUsersController",
			controllerAs: "vm"
		})
		.state('home.listgroups', {
			url: "/listgroups",
			templateUrl: "pages/listgroups.html"
		})
		.state('home.natter', {
			url: "/natter/{receiverId}",
			templateUrl: "pages/conversation.html",
			params: {
				receiverId: null
			},
			controller: "ConversationController",
			controllerAs: "vm"
		});


	$urlRouterProvider.otherwise('/home');

}