app.controller("occurencyController", function($scope, $state, $rootScope, $mdDialog){
	$rootScope.toolbarTitle = 'Registrar Ocorrência';

	$scope.occurencyTypes = [
		{title: 'Geral', icon: 'report_problem', type: 'GENERAL', color: '#F44336'}, 
		{title: 'Acidentes de Trânsito', icon: 'time_to_leave', type: 'CRASH', color: '#3F51B5'},  
		{title: 'Ocorrências Médicas', icon: 'local_hospital', type: 'MEDICAL', color: '#E91E63'},
		{title: 'Incêndios', icon: 'whatshot', type: 'FIRE', color: '#673AB7'},
		{title: 'Animais', icon: 'bug_report', type: 'ANIMAL', color: '#E91E63'},  
		{title: 'Choque elétrico', icon: 'flash_on', type: 'ELETRIC', color: '#2196F3'}
	]

	$scope.occurencyStep = 0;
	$scope.gPlace;

	$scope.userAddress = {};

	$scope.autocompleteOptions = {
        componentRestrictions: { country: 'br' },
        types: ['geocode']
    }

	$scope.initOccurency = function(t){
		$scope.newOccurency = {
			user: {
				phone: "",
				name: "",
				gender: "",
				age: "",
				complaint: ""
			},
			comment: "",
			address: {
				city: "",
				state: "",
				zip: "",
				country: "",
				number: "",
				street: "",
				complete: "",
				neighborhood: ""
			},
			lat: 0,
			lng: 0,
			location: [0, 0],
			type: t,
		    medical:false,
		    status: "PENDING",
		    grau: 0
		}
		$scope.occurencyStep = 1;
	}

	$scope.$watch('myScopeVar', function() {
        if(angular.isObject($scope.myScopeVar)){
        	$scope.newOccurency.lat = $scope.myScopeVar.geometry.location.lat();
        	$scope.newOccurency.lng = $scope.myScopeVar.geometry.location.lng();

        	var address = {}
        	for(var i=0; i<$scope.myScopeVar.address_components.length; i++){
        		if($scope.myScopeVar.address_components[i].types[0] == 'street_number')
        			address.number = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'route')
        			address.street = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'sublocality_level_1')
        			address.city = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'administrative_area_level_2')
        			address.neighborhood = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'administrative_area_level_1')
        			address.state = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'country')
        			address.country = $scope.myScopeVar.address_components[i].long_name;
        		else if($scope.myScopeVar.address_components[i].types[0] == 'postal_code_prefix')
        			address.zip = $scope.myScopeVar.address_components[i].long_name;
        	}
        	$scope.newOccurency.address = address;
        }
    });

	$scope.backOccurency = function(){
		$scope.occurencyStep = 0;
	}

	$scope.createOccurency = function(){
		if($scope.newOccurency.lat == null || $scope.newOccurency.lat == '' || $scope.newOccurency.lng == '' || $scope.newOccurency.lng == null){
			$rootScope.showToast('Digite um endereço para registar a ocorrência!');
		} else {
			$scope.newOccurency.location = [$scope.newOccurency.lng, $scope.newOccurency.lat];
			$rootScope.reqWithToken('/occurence/new', $scope.newOccurency, 'POST', function(successData){
				$scope.occurencyStep = 0;
				$scope.newOccurency= {};
				$rootScope.showToast("Ocorrência criada com sucesso!");
			}, function(errorData){
				$rootScope.mdAlert('Ops!', "Verifique sua conexão e tente novamente.", 'Ok');
			}, true)
		}
	}

	$scope.endOccurency = function(){
		if($scope.newOccurency.lat == null || $scope.newOccurency.lat == '' || $scope.newOccurency.lng == '' || $scope.newOccurency.lng == null){
			$rootScope.showToast('Digite um endereço para registar a ocorrência!');
			return;
		}
		if($scope.newOccurency.lng && $scope.newOccurency.lat)
			$scope.newOccurency.location = [$scope.newOccurency.lng, $scope.newOccurency.lat];
		$scope.newOccurency.status = 'FINISHED';
		$scope.newOccurency.startDate = new Date();
		$scope.newOccurency.finishedDate = new Date();
		$scope.newOccurency.attendedDate = new Date();
		$rootScope.reqWithToken('/occurence/new', $scope.newOccurency, 'POST', function(successData){
			$scope.occurencyStep = 0;
			$rootScope.selectedOccurencyAux = $scope.newOccurency;
			$scope.newOccurency= {};
			$mdDialog.show({
	            controller: function($scope, $rootScope) {
	            	$scope.selectedOccurency = $rootScope.selectedOccurencyAux;
	            	$scope.close = function(){
	            		$mdDialog.cancel();
	            	}
	            	$scope.save = function(){
	            		$rootScope.showToast("Ocorrência arquivada com sucesso!");
	            	}
	            },
	            templateUrl: 'view/dashboard/occurency/modal/closeInfo.html',
	            clickOutsideToClose: true
	        }).then(function(answer) {}, function() {
	            $mdDialog.cancel();
	        });
			$rootScope.showToast("Ocorrência finalizada com sucesso!");
		}, function(errorData){
			$rootScope.mdAlert('Ops!', "Verifique sua conexão e tente novamente.", 'Ok');
		}, true)
	}

	if(localStorage.getItem('showInfo') == 0)
		$scope.showInfo = false;
	else
		$scope.showInfo = true;
	$scope.closeInfo = function(n){
		if(n == 1){
			localStorage.setItem('showInfo', 0);
			$scope.showInfo = false;
		} else {
			$scope.showInfo = false;
		}
	}
})