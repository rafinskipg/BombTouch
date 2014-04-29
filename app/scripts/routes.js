define(['angular', 'app'], function(angular, BombTouchApp){
    
  BombTouchApp.config(['$routeProvider', function($routeProvider) {
    
    $routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeCtrl'
		});
		
    $routeProvider.when('/main', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    });
    $routeProvider.when('/badges', {
      templateUrl: 'views/badges.html',
      controller: 'BadgesCtrl'
    });
    $routeProvider.when('/gameover', {
      templateUrl: 'views/gameover.html',
      controller: 'GameOverCtrl'
    });

		$routeProvider.otherwise({redirectTo: '/'});
	}]);
    
 });