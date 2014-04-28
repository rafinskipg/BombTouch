define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('GameOverCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv) {
        $scope.bestScore = localStorageSrv.getBestScore();

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
