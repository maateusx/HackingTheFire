app.controller("homeController", function($scope, $state, $rootScope){
	$rootScope.toolbarTitle = 'Home';

  $scope.pathBase = 'assets/images/';
  $scope.icons = [{
    avaible: {
      icon: $scope.pathBase + 'car-mark-verde.png'
    },
    busy: {
      icon: $scope.pathBase + 'car-mark-amarelo.png'
    },
    fireman: {
      icon: $scope.pathBase + 'fav.png'
    }
  }];

  $scope.iconsOccurence = [
    "assets/images/flag-map-azul.png",
    "assets/images/flag-map-amarelo.png",
    "assets/images/flag-map-vermelho.png"
  ];

  $scope.initialMap = {lat: -18.899895, lng:-48.258990};
  $scope.myMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: $scope.initialMap
  });

  $scope.firetrucksNumber = {
    busy: 0,
    online: 0
  }

  $scope.initMap = function() { 
        for(var i=0;  i<$scope.firetrucks.length; i++){
          if($scope.firetrucks[i].online){
            if($scope.firetrucks[i].busy){
              $scope.firetrucks[i].icon = 'assets/images/car-mark-vermelho.png';
              $scope.firetrucksNumber.busy++;
            }
            else{
              $scope.firetrucksNumber.online++;
              $scope.firetrucks[i].icon = 'assets/images/car-mark-verde.png';
            }
            $scope.initialMap = {lat: $scope.firetrucks[i].lat, lng: $scope.firetrucks[i].lng};
            var marker = new google.maps.Marker({
              position: $scope.initialMap,
              icon: $scope.firetrucks[i].icon,
              map: $scope.myMap
            });
          }
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
    $scope.openOccurences = [];

    $scope.query = {
        order: '-priority creationAt',
        limit: 1000,
        page: 1,
        search: "",
        date: "",
        status: ""
    };

    $scope.occurencesNumber =0;
    $scope.listOccurences = function(){
      $rootScope.reqWithToken('/occurence/list?search=' + $scope.query.search +
                        "&page=" + $scope.query.page +
                        "&pageSize=" + $scope.query.limit +
                        "&order=" + $scope.query.order, null, 'GET', function(successData){
                                      $scope.occurencesNumber = successData.occurences.length;
                                      for(var i=0;i<successData.occurences.length; i++) {
                                        $scope.initialMap = {lat: successData.occurences[i].lat, lng: successData.occurences[i].lng};
                                        if(successData.occurences[i].priority > 0) {
                                          var g = successData.occurences[i].priority;
                                        } else {
                                          var g = 0;
                                        }
                                        var marker = new google.maps.Marker({
                                          position: $scope.initialMap,
                                          icon: $scope.iconsOccurence[g],
                                          map: $scope.myMap
                                        });
                                      }
                                      
      }, function(errorData){
        $rootScope.mdAlert('Fireman', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
      }, false);
    }

  $scope.listOccurences();

  $scope.$on('updatePortalOccurence', function(event, data) {
    $scope.listOccurences();
  })  

})

