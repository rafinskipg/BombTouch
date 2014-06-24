define(['angular', 'app', 'controllers/home', 'controllers/badges', 'controllers/prototypes','controllers/prototype_play','controllers/topMenu','controllers/main', 'controllers/difficulty'], function(angular, BombTouchApp){
    
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
    $routeProvider.when('/difficulty', {
      templateUrl: 'views/difficulty.html',
      controller: 'DifficultyCtrl'
    }); 

    $routeProvider.when('/levels', {
      templateUrl: 'views/levels.html',
      controller: 'LevelsCtrl'
    });

    $routeProvider.when('/prototypes', {
      templateUrl: 'views/prototypes.html',
      controller: 'PrototypesCtrl'
    });
    $routeProvider.when('/prototype_play', {
      templateUrl: 'views/main.html',
      controller: 'PrototypePlayCtrl'
    });


		$routeProvider.otherwise({redirectTo: '/'});
	}]);
    
 });