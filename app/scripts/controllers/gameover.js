define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('GameOverCtrl',
      ['$scope','localStorageSrv','$location','quotesSrv','socialSrv',
      function ($scope, localStorageSrv, $location,quotesSrv, socialSrv) {
       
        $scope.bestScore = localStorageSrv.getBestScore();
        $scope.goHome  = function(){
          $location.path("/");
        }
        $scope.isMobile = window.isMobile ? true : false;

        $scope.lastScore = localStorageSrv.getLastScore();

        quotesSrv.getQuote()
          .then(function(quote){
            $scope.quote = quote;
          });

        $scope.playAgain = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          GAME.start();
        } 

        $scope.share = function(){
          socialSrv.share( "I've just scored "+ $scope.lastScore+" on the Nyan Cat adventures! Wow! Such funny, very game! Check it out http://rvpg.me ! ")
        }


      }]);
});
