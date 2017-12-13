app.controller('sidebarController',function($rootScope, $scope, $mdDialog, $state){
	
	$rootScope.sidebarContents = [
		{name:'Home', icon:'dashboard', state:"dashboard.home"},
		{name:'Ocorrência', icon:'headset_mic', state:"dashboard.occurency"},
		{name:'Equipe Médica', icon:'local_hospital', state:"dashboard.doctor"},
		{name:'Despacho', icon:'recent_actors', state:"dashboard.office"},
		{name:'Histórico', icon:'timer', state:"dashboard.history"},
		{name:'Relatórios', icon:'poll', state:"dashboard.report"},
		{name:'Recursos', icon:'drive_eta', state:"dashboard.resource"},
		{name:'Sugestões', icon:'message', state:"dashboard.suggestion"},
		{name:'Sair', icon:'undo', state:""}  
	]

	$rootScope.sidebarExecute = function(index) {
		if($rootScope.sidebarContents[index].name == "Sair")
			$rootScope.showConfirm();
		else
			$state.go($rootScope.sidebarContents[index].state);
	}

	$rootScope.showConfirm = function() {
	    var confirm = $mdDialog.confirm()
	          .title('Você deseja realizar o logout?')
	          .textContent('Vamos sentir sua falta :(')
	          .ok('Confirmar')
	          .cancel('Cancelar');
	    $mdDialog.show(confirm).then(function() {
	    	localStorage.clear();
	      	$state.go('login');
	    }, function() {
	    });
	};
	
})