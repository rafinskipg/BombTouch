define(['angular', 'app'], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('MainCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','gameSrv','$location','badgesSrv',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv,gameSrv, $location,badgesSrv) {
        $scope.puntos = 0;
        $scope.paused = false;
        $scope.megaShootActive = false;

        $scope.start = function(){
          gameSrv.play('canvas');
        }

        $scope.exit = function(){
          gameSrv.exit();
          $location.path("/");
        }

        //Observer of the game
        gameSrv.suscribeGameOver(function(opts){
          opts.gameState.times = opts.times;
          opts.gameState.newBadges = badgesSrv.checkIfWonBadges(opts.gameState, settingsSrv.getLevel());
          localStorageSrv.saveGameState(opts.gameState);
          $location.path('/gameover');
        }, 'main_gameover');
        
        $scope.start();

      }]);
});




