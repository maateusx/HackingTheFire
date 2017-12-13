app.controller("resourceController", function($scope, $state, $rootScope){
	$rootScope.toolbarTitle = 'Recursos';

  $scope.fireIcon = ['assets/images/car-mark-verde.png', 'assets/images/car-mark-amarelo.png', 'assets/images/car-mark-vermelho.png'];

  $scope.trucksNumber = {
    avaible: 0,
    busy: 0,
    offline: 0
  }
	$scope.initMap = function() {
        $scope.initialMap = {lat: -18.899895, lng:-48.258990};
        $scope.myMap = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: $scope.initialMap
        });

        for(var i=0;  i<$scope.firetrucks.length; i++){
          if($scope.firetrucks[i].online){
            if($scope.firetrucks[i].busy){
              $scope.firetrucks[i].icon = $scope.fireIcon[1];
              $scope.trucksNumber.busy++;
            }
            else{
              $scope.firetrucks[i].icon = $scope.fireIcon[0];
              $scope.trucksNumber.avaible++;
            }
          } else {
            $scope.firetrucks[i].icon = $scope.fireIcon[2];
            $scope.trucksNumber.offline++;
          }
          $scope.initialMap = {lat: $scope.firetrucks[i].lat, lng: $scope.firetrucks[i].lng};
          var marker = new google.maps.Marker({
            position: $scope.initialMap,
            icon: $scope.firetrucks[i].icon,
            map: $scope.myMap
          });
        }
    }
    
    $scope.getTrucks = function(){
      $rootScope.reqWithToken('/firetruck/list', null, 'GET', function(success){
        $scope.firetrucks = success.firetrucks;
        $scope.initMap();
      }, function(error){
        $rootScope.showToast("Verifique sua conexão e tente novamente!");
        $scope.initMap();
      }, true);
    }

    $scope.$on('firetruckInfo', function(event, data) {
      $scope.getTrucks();
    })
    $scope.getTrucks();

})