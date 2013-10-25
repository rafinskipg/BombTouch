define(['angular', 'app'], function(angular, myApp){
    return myApp.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		});
		
		$routeProvider.otherwise({redirectTo: '/'});
	}]);
 });