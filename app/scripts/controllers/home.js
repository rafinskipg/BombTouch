define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('HomeCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv', 'settingsSrv',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv, settingsSrv) {

        $scope.bestScore = localStorageSrv.getBestScore();
                
        $scope.getSound = function(){
          return settingsSrv.getSound() ? 'ON': 'Off';
        }
        $scope.setSound = function(){ 
          settingsSrv.getSound() ? settingsSrv.setSound(false): settingsSrv.setSound(true);
        }

        $scope.play = function(){
          window.location.href = '/#/main';
        }

        $scope.badges = function(){
          window.location.href = '/#/badges';
        }

      }]);
});




