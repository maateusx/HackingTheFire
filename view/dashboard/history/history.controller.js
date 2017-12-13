app.controller("historyController", function($scope, $state, $rootScope, $mdDialog){
	$rootScope.toolbarTitle = 'Histórico';

	$scope.closedOccurences = [];

	$scope.firetruck = [];

	$scope.query = {
        order: '-priority creationAt',
        limit: 1000,
        page: 1,
        search: "",
        date: "",
        status: ""
    };

    $scope.reorder = function() {
        $scope.query.page = 1;
        $scope.listOccurences();
    }

	$scope.listOccurences = function(){
		$rootScope.reqWithToken('/occurence/list?search=' + $scope.query.search +
					            "&page=" + $scope.query.page +
					            "&pageSize=" + $scope.query.limit +
					            "&status=FINISHED&order=" + $scope.query.order, null, 'GET', function(successData){
			for (var i in successData.occurences) {
                successData.occurences[i].createdDateTime = (new Date(successData.occurences[i].creationAt)).getTime();
            }
			$scope.closedOccurences = successData.occurences;
			$scope.countOccurences = successData.count;
		}, function(errorData){
			$rootScope.mdAlert('Bombeiros', 'Nao foi possivel recuperar o histórico de ocorrencias. Verifique sua conexão.', 'Ok');
		}, false);
	}
	$scope.listOccurences();

	$scope.openInfo = function(info){
		$rootScope.selectedInfoAux = info;
		$mdDialog.show({
            controller: function($scope, $rootScope) {
            	$scope.selectedInfo = $rootScope.selectedInfoAux;
            	$scope.selectedInfoAddress = $scope.selectedInfo.address.street + ", " + $scope.selectedInfo.address.number + " - " + $scope.selectedInfo.address.city;
            	$scope.close = function(){
            		$mdDialog.cancel();
            	}
            },
            templateUrl: 'view/dashboard/history/modal/info.html',
            clickOutsideToClose: true
        }).then(function(answer) {}, function() {
            $mdDialog.cancel();
        });
	}
})