define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('HomeCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv) {
        
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




