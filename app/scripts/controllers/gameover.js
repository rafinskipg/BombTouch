define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('GameOverCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv','$location',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv, $location) {
        $scope.bestScore = localStorageSrv.getBestScore();
        $scope.goHome  = function(){
          $location.path("/");
        }
        $scope.isMobile = window.isMobile ? true : false;

        $scope.playAgain = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          GAME.start();
        } 

        $scope.share = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          GAME.restart();
        }


      }]);
});
