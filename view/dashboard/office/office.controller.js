app.controller("officeController", function($scope, $state, $rootScope, $mdDialog, $mdToast){
	$rootScope.toolbarTitle = 'Despacho';

	$scope.openOccurences = [];
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
					            "&order=" + $scope.query.order, null, 'GET', function(successData){
                                    console.log(JSON.stringify(successData));
			for (var i in successData.occurences) {
                successData.occurences[i].createdDateTime = (new Date(successData.occurences[i].creationAt)).getTime();

                successData.occurences[i].complete_address = successData.occurences[i].street + ", " + successData.occurences[i].number;
            }
			$scope.openOccurences = successData.occurences;
			$scope.countOccurences = successData.count;
		}, function(errorData){
			$rootScope.mdAlert('Fireman', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
		}, false);
	}

	$scope.listOccurences();
	


	$scope.$on('updatePortalOccurence', function(event, data) {
		$scope.listOccurences();
    })

	$scope.changePriority = function(occurenceId, value){
		$rootScope.reqWithToken('/occurence/' + occurenceId, {priority: value}, 'PUT', function(successData){
			$mdToast.show(
		      $mdToast.simple()
		        .textContent('Prioridade atualizada com sucesso!')
		        .position('bottom right')
		        .hideDelay(3000)
		    );
		}, function(errorData){
			$rootScope.mdAlert('Fireman', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
		}, false);
	}

	$scope.send = function(occurence) {
        $mdDialog.show({
            controller: function($scope, $rootScope, $mdToast, $filter, $timeout, $log) {
                $scope.modalSend = angular.copy(occurence);
                $scope.cancel = $mdDialog.cancel;
                $scope.actionTitle = 'Enviar recurso';
                $scope.actionButton = 'Confirmar';

                $rootScope.reqWithToken('/occurence/'+ occurence._id + '/firetrucks', null, 'GET', function(successData){
					$scope.modalSend.firetrucks = successData;
				}, function(errorData){
					$rootScope.mdAlert('Fireman', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
				}, false);

				$scope.changeStatus = function(firetruck){
					if(firetruck.busy){
						$rootScope.reqWithToken('/occurence/'+ occurence._id + '/firetruck/' + firetruck._id, null, 'PUT', function(successData){
							$rootScope.showToast('Recurso enviado com sucesso.')
						}, function(errorData){
							$rootScope.showToast('Não foi possível enviar o recurso.')
						}, false);
					}else{
						$rootScope.reqWithToken('/occurence/'+ occurence._id + '/firetruck/' + firetruck._id, null, 'DELETE', function(successData){
							$rootScope.showToast('Recurso liberado com sucesso.')
						}, function(errorData){
							$rootScope.showToast('Não foi possível liberar o recurso.')
						}, false);
					}
					
				}

                $scope.done = function () {
                    if($scope.modalCategory.name == '') {
                        $mdToast.show(
                          $mdToast.simple()
                          .textContent('Por favor, insira o nome da categoria.')
                          .position('right bottom')
                          .hideDelay(3000)
                        );
                        return;
                    } 

                    $rootScope.reqWithToken('/api/category/'+category._id+'/update', $scope.modalCategory, 'POST', function(success){
                        $mdDialog.show(
                            $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title("Bombeiros")
                            .textContent("Categoria atualizada com sucesso.")
                            .ok('OK')
                            .targetEvent()
                          );
                        $rootScope.initialize();
                    }, function(error) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent($rootScope.error[ error.err ])
                            .position('right bottom')
                            .hideDelay(3000)
                        );
                    })
                }
            },
            templateUrl: 'view/dashboard/office/officeModal.html',
            clickOutsideToClose: true
        }).then(function(answer) {}, function() {
            $mdDialog.cancel();
        });
    }

    $scope.edit = function(occurence) {
        $mdDialog.show({
            controller: function($scope, $rootScope, $mdToast, $filter, $timeout, $log) {
                $scope.modalEdit = angular.copy(occurence);
                $scope.cancel = $mdDialog.cancel;
                $scope.actionTitle = 'Editar Ocorrência';
                $scope.actionButton = 'Salvar';

                $scope.save = function () {
                    $rootScope.reqWithToken('/occurence/'+ occurence._id, $scope.modalEdit, 'PUT', function(successData){
                        $rootScope.showToast('Ocorrência atualizada com sucesso!');
                    }, function(errorData){
                        $rootScope.showToast('Nao foi possivel atualizar a ocorrência!');
                    }, false);
                }
            },
            templateUrl: 'view/dashboard/office/officeEditModal.html',
            clickOutsideToClose: true
        }).then(function(answer) {}, function() {
            $mdDialog.cancel();
        });
    }

    $scope.showConfirm = function(occurence) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Tem certeza que deseja finalizar a ocorrência?')
              .textContent('Ao clicar aqui o status da ocorrência será mudado para finalizado.')
              .ok('Sim')
              .cancel('Não');

        $mdDialog.show(confirm).then(function() {
          $rootScope.reqWithToken('/occurence/'+ occurence._id + "/admin/finish",null, 'POST', function(successData){
                        $rootScope.showToast('Finalizado com sucesso!');
                    }, function(errorData){
                        $rootScope.showToast('Nao foi possivel finalizar a ocorrencia!!');
                    }, false);
        }, function() {
        });
      };

})