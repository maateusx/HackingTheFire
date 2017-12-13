angular.module('fireman.dashboard', [
  'ui.router',
])
  
.config(
	[   '$stateProvider', '$urlRouterProvider',
    	function ($stateProvider, $urlRouterProvider, $state, $mdDialog) {

    		$stateProvider
	        .state('dashboard', {
	        	url: '/dashboard',
	        	templateUrl: 'view/dashboard/dashboard.html',
				controller: function($rootScope){
					$rootScope.socket = io($rootScope.socketURL, {
                        "forceNew": true
                    });
                    $rootScope.socket.on('connect', function() {
                    });		

                    $rootScope.socket.on('updatePortalOccurence', function(data) {
                        $rootScope.$broadcast('updatePortalOccurence', data);
                    });

                    $rootScope.socket.on('firetruckInfo', function(data) {
                        $rootScope.$broadcast('firetruckInfo', data);
                    });

                    $rootScope.socket.on('newPortalMessage', function(data) {
                    	if(data.occurence == $rootScope.modalMessage){
                    		$rootScope.$broadcast('newPortalMessage', data);
                    		return;
                    	}
                    	$rootScope.modalMessage = data.occurence;
                        $mdDialog.show({
				        controller: function($scope, $rootScope) {

				        	$scope.$on('newPortalMessage', function(event, data) {
								$scope.messages.push(data);
								$scope.$apply();
						    })

				        	$rootScope.reqWithToken('/occurence/'+data.occurence, null, 'GET', function(successData){
								$scope.occurence = successData;
								$rootScope.reqWithToken('/occurence/'+data.occurence+'/message/portal', null, 'GET', function(successData){
									$scope.messages = successData;
								}, function(errorData){
									$rootScope.mdAlert('Ops!', "Verifique sua conexão e tente novamente.", 'Ok');
								}, false)
							}, function(errorData){
								$rootScope.mdAlert('Ops!', "Verifique sua conexão e tente novamente.", 'Ok');
							}, true)
				        	$scope.close = function(){
				        		$mdDialog.cancel();
				        	}
				            $scope.sendMessage = function(){
				            	var message = {
				            		message: $scope.message.text,
				            		creationAt: new Date()
				            	}
				            	$rootScope.reqWithToken('/occurence/'+data.occurence+'/message/portal', message, 'POST', function(successData){
									$scope.messages.push(message);
									$scope.message.text = '';
								}, function(errorData){
									$rootScope.mdAlert('Ops!', "Verifique sua conexão e tente novamente.", 'Ok');
								}, false)
				            }
				        },
				        templateUrl: 'view/dashboard/components/chat/chatModal.html',
				        clickOutsideToClose: true
				        }).then(function(answer) {}, function() {
				            $mdDialog.cancel();
				        });
                    });
	            }
	        })
	        
	        .state('dashboard.home', {
	        	url: '/home',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/home/home.html',
		        		controller: 'homeController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.occurency', {
	        	url: '/occurency',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/occurency/occurency.html',
		        		controller: 'occurencyController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.doctor', {
	        	url: '/doctor',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/doctor/doctor.html',
		        		controller: 'doctorController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.office', {
	        	url: '/office',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/office/office.html',
		        		controller: 'officeController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.history', {
	        	url: '/history',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/history/history.html',
		        		controller: 'historyController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.suggestion', {
	        	url: '/suggestion',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/suggestion/suggestion.html',
		        		controller: 'suggestionController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.resource', {
	        	url: '/resource',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/resource/resource.html',
		        		controller: 'resourceController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })

		    .state('dashboard.report', {
	        	url: '/report',
		        views:{
		        	'':{
		        		templateUrl: 'view/dashboard/report/report.html',
		        		controller: 'reportController'
		        	},
		        	'sidebar':{
		        		templateUrl: 'view/dashboard/components/sidebar/sidebar.html',
		        		controller: 'sidebarController'
		        	},
		        	'toolbar':{
		        		templateUrl: 'view/dashboard/components/toolbar/toolbar.html',
		        		controller: 'toolbarController'
		        	}
		        }
		    })
    	}
	]
);

