define([
  'angular',
  'app'
], function (angular, BombTouchApp) {
  BombTouchApp.config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      });
      $routeProvider.otherwise({ redirectTo: '/' });
    }
  ]);
});