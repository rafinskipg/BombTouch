define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    BombTouchApp.filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    });

    return BombTouchApp.controller('ScoresCtrl',
      ['$scope', 'localStorageSrv','$location', 'socialSrv',
      function ($scope,  localStorageSrv, $location, socialSrv) {
        $scope.bestScore = localStorageSrv.getBestScore();
        
        $scope.goHome  = function(){
          $location.path("/");
        }
        
        $scope.isMobile = window.isMobile ? true : false;

        $scope.scores = localStorageSrv.getScores();
        $scope.totals = localStorageSrv.getTotals();

        $scope.share = function(){
          socialSrv.share('My best score, on the Cool Dog game... :D '+ $scope.bestScore+' points!');
        }

        $scope.identity = angular.identity;
      }]);
});
