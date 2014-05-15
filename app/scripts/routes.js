define(['angular', 'app', 'controllers/home', 'controllers/badges', 'controllers/main'], function(angular, BombTouchApp){
    
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

    $routeProvider.when('/scores', {
      templateUrl: 'views/scores.html',
      controller: 'ScoresCtrl'
    });

		$routeProvider.otherwise({redirectTo: '/'});
	}]);
    
 });