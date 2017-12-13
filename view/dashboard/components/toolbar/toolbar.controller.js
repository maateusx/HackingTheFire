app.controller('toolbarController',function($mdSidenav, $rootScope){

	$rootScope.openSidebar = function(){
		if($mdSidenav('left').isOpen()){
			$mdSidenav('left').close();
		}else{
			$mdSidenav('left').open();
		}
	}
	
})