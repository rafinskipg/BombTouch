define(['angular', 'app', 'services/gameSrv'], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('TopMenuCtrl',
      ['$scope', '$timeout',  'settingsSrv','audioSrv', 'gameSrv',
      function ($scope, $timeout, settingsSrv,audioSrv, gameSrv) {
        $scope.puntos = 0;
        $scope.paused = false;

        $scope.getSound = function(){
          return settingsSrv.getSound();
        }

        $scope.toggleSound = function(){ 
          var toSet = settingsSrv.getSound() ? false : true;
          settingsSrv.setSound(toSet);
          if(toSet == false){
            audioSrv.pauseSong();
          }else{
            audioSrv.playSong();
          }
        }

        $scope.pause = function(){
          $scope.paused = true;
          audioSrv.pauseSong();
          gameSrv.pause();
        }
        $scope.resume = function(){
          $scope.paused = false;
          audioSrv.playSong();
          gameSrv.resume();
        }

        $scope.showMenu = function(){
          $scope.menuVisible = true;
        }
        $scope.hideMenu = function(){
          $scope.menuVisible = false;
        }

        gameSrv.suscribePoints(function(points){
          $scope.puntos = points;
        },'top_menu_points');

        gameSrv.suscribeGameOver(function(){
          audioSrv.stopSounds();
        },'top_menu_gameover')

      }]);
});




