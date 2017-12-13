app.controller("suggestionController", function($scope, $state, $mdToast, $rootScope, $mdDialog){
	$rootScope.toolbarTitle = 'Sugestões';

	$scope.suggestions = [];
	$scope.query = {
        order: '-creationAt',
        limit: 1000,
        page: 1,
        search: "",
        date: "",
        status: ""
    };

    $scope.reorder = function() {
        $scope.query.page = 1;
        $scope.listSuggestions();
    }

	$scope.listSuggestions = function(){
		$rootScope.reqWithToken('/suggestion/list?search=' + $scope.query.search +
					            "&page=" + $scope.query.page +
					            "&pageSize=" + $scope.query.limit +
					            "&order=" + $scope.query.order, null, 'GET', function(successData){
			$scope.suggestions = successData.suggestions;
			$scope.countSuggestions = successData.count;
		}, function(errorData){
			$rootScope.mdAlert('Bombeiros', 'Nao foi possivel recuperar a lista de sugestões. Verifique sua conexão.', 'Ok');
		}, false);
	}

	$scope.listSuggestions();

    $scope.showConfirm = function(suggestionId, solved) {
        if(solved){
            $mdToast.show(
              $mdToast.simple()
                .textContent('Essa sugestão já foi resolvida.')
                .position('bottom right')
                .hideDelay(3000)
            );
        }else{
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Bombeiros MG')
                  .textContent('Deseja marcar essa sugestão como atendida?')
                  .ok('Sim')
                  .cancel('Não');

            $mdDialog.show(confirm).then(function() {
                $rootScope.reqWithToken('/suggestion/' + suggestionId, {solved: true}, 'PUT', function(successData){
                    $mdToast.show(
                      $mdToast.simple()
                        .textContent('Sugestão atualizada com sucesso!')
                        .position('bottom right')
                        .hideDelay(3000)
                    );

                    $scope.listSuggestions();
                }, function(errorData){
                    $rootScope.mdAlert('Bombeiros', 'Nao foi possivel recuperar a lista de sugestões. Verifique sua conexão.', 'Ok');
                }, false);
            }, function() {
              $scope.status = '';
            }); 
        }
        
    };
	
})