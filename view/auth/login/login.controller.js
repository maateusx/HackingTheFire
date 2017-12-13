app.controller("loginController", function($scope, $rootScope, $state){

	$scope.credentials = {
		username: '',
		password: ''
	}

	$scope.login = function(){
		if($scope.credentials.username == null || $scope.credentials.username == ''){
			$rootScope.showToast('Por favor, digite seu usuário');
		} else if($scope.credentials.password == null || $scope.credentials.password == ''){
			$rootScope.showToast('Por favor, digite sua senha');
		} else {	
			$rootScope.req('/moderator/login', $scope.credentials, 'POST', function(successData){
				localStorage.setItem('access_token', successData.access_token);
				$state.go('dashboard.home');
			}, function(errorData){
				$rootScope.showToast('Por favor, verifique os dados digitados e tente novamente.');
			}, true);
		}
	}

	if(localStorage.getItem('access_token') != null && localStorage.getItem('access_token')!= ''){
		$state.go('dashboard.home');
	}

})