app.controller("doctorController", function($scope, $state, $rootScope,$mdDialog){
	$rootScope.toolbarTitle = 'Departamento Médico';

    $scope.openOccurences = [];

	$scope.query = {
        order: '-priority creationAt',
        limit: 100,
        page: 1,
        search: "",
        date: "",
        status: ""
    };

	$scope.listOccurences = function(){
		$rootScope.reqWithToken('/occurence/list?search=' + $scope.query.search + 
                                "&order=" + $scope.query.order +
					            "&page=" + $scope.query.page +
					            "&pageSize=" + $scope.query.limit+'&medical=true', null, 'GET', function(successData){
			$scope.openOccurences = successData.occurences;
            console.log(successData)
		}, function(errorData){
			$rootScope.mdAlert('Bombeiro', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
		}, false);
	}
	$scope.listOccurences();

    $scope.remove = function(r){
        $scope.openOccurences.split($scope.openOccurences.indexOf(r), 1);
        $rootScope.showToast("Ocorrência finalizada com sucesso!");
    }

    $scope.openOccurenceInfo = function(occurence){
        $rootScope.selectedOccurenceAux = occurence;

        $mdDialog.show({
            controller: function($scope, $rootScope) {
                $scope.selectedOccurenceMedic = $rootScope.selectedOccurenceAux;
                $scope.close = function(){
                    $mdDialog.cancel();
                }
            },
            templateUrl: 'view/dashboard/doctor/modal/modal.html',
            clickOutsideToClose: true
        });
    }

    $scope.openSignals = function(occurence){
        $rootScope.selectedOccurenceAux = occurence;
        $mdDialog.show({
        controller: function($scope, $rootScope) {

            $scope.selectedOccurence = $rootScope.selectedOccurenceAux;
            $scope.cancel = function(){
                $mdDialog.cancel();
            }

            $scope.update = function(){
                
            }
        },
        templateUrl: 'view/dashboard/doctor/modal/signals.html',
        clickOutsideToClose: true
        }).then(function(answer) {}, function() {
            $mdDialog.cancel();
        });
    }
    
})