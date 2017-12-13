angular.module('fireman.auth', [
  'ui.router'
])
  
.config(
	[   '$stateProvider', '$urlRouterProvider',
    	function ($stateProvider,   $urlRouterProvider, $state) {

    		$stateProvider
	        .state('login', {
	        	url: '/login',
	        	views:{
		        	'':{
		        		templateUrl: 'view/auth/login/login.html',
		        		controller: 'loginController'
		        	}
		        }
	        })

    	}
	]
);

