define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
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
          socialSrv.share('My best score, on the nyan cat game... :D '+ $scope.bestScore+' points!');
        }

      }]);
});
