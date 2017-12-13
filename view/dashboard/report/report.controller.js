app.controller("reportController", function($scope, $state, $rootScope){
	$rootScope.toolbarTitle = 'Relatórios';

	$scope.initSecondaryMap = function(data){
      var heatMapData = [];
      for(var j = 0; j<data.length; j++){
        heatMapData.push({location: new google.maps.LatLng(data[j].lat, data[j].lng), weight: 2+data[j].priority},
        new google.maps.LatLng(data[j].lat, data[j].lng))
      }

      var udi = new google.maps.LatLng(-18.899895, -48.258990);

      secondaryMap = new google.maps.Map(document.getElementById('secondaryMap'), {
        center: udi,
        zoom: 13
      });

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData
      });
      heatmap.setMap(secondaryMap);
    }

	$scope.listOccurences = function(){
    	$rootScope.reqWithToken('/occurence/list/all', null, 'GET', function(successData){
	        $scope.initSecondaryMap(successData.occurences);
	        $scope.occurencesTotal = successData.occurences.length;                                                          
	      }, function(errorData){
	        $rootScope.mdAlert('Fireman', 'Nao foi possivel recuperar a lista de ocorrencias. Verifique sua conexão.', 'Ok');
	    }, false);
	}
	$scope.listOccurences();
})