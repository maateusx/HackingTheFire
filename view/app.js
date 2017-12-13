var app = angular.module('fireman', [
  'fireman.auth',
  'fireman.dashboard',
  'ngMaterial',
  'ngAnimate',
  'ui.router',
  'ngMdIcons',
  'ngMask',
  'google.places',
  'md.data.table',
  'timer'
])

.run(function ($rootScope, $http, $location, $mdDialog, $state, $mdToast) {
  $rootScope.$state = $state;

  $rootScope.reqApiURL = "http://172.10.100.93/api";
  $rootScope.socketURL = "http://172.10.100.93:8080";
 
  $rootScope.req = function(service, params, type, success, error, loading){
    if(loading)
      $rootScope.isLoading = true;
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      data: params  
    })
    .success(function(data){
      if(loading)
        $rootScope.isLoading = false;
      success(data);
    })
    .error(function(err){
      if(loading)
        $rootScope.isLoading = false;
      error(err);
    });  
  }

  $rootScope.reqWithToken = function(service, params, type, success, error, loading){
    if(loading)
      $rootScope.isLoading = true;
    $http({
      url: $rootScope.reqApiURL + service,
      method: type,
      data: params,
      headers: { 'access_token': localStorage.getItem("access_token")}   
    })
    .success(function(data){
      if(loading)
        $rootScope.isLoading = false;
      success(data);
    })
    .error(function(err){
      if(loading)
        $rootScope.isLoading = false;
      error(err);
    });  
  }

  $rootScope.mdAlert = function(title, text, button){
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(text)
        .ok(button)
        .targetEvent()
    );
  }

  $rootScope.showToast = function(message){
    $mdToast.show(
      $mdToast.simple()
      .textContent(message)
      .position('right bottom')
      .hideDelay(3000)
    );
  }

})

.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise('/login');
})

.config(function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!')
})

.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });
                event.preventDefault();
            }
        });
    };
});

app.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {country: 'br'}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                  model.$setViewValue(element.val());                
                });
            });
        }
    };
});