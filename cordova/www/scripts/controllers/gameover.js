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

        $scope.gameState = localStorageSrv.getLastGameState();
        $scope.totals = localStorageSrv.getTotals();
        //TODO SHOW LIST OF WON BADGES
        //
        quotesSrv.getQuote()
          .then(function(quote){
            $scope.quote = quote;
          });

        $scope.share = function(e){
          e.preventDefault();
          socialSrv.share( "I've just scored "+ $scope.gameState.points+" on the Cool Dog adventures! Wow! Such funny, very game!! ")
        }

      }]);
});
