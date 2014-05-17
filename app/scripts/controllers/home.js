define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('HomeCtrl',
      ['$scope', 'localStorageSrv', 'settingsSrv', '$location',
      function ($scope, localStorageSrv, settingsSrv, $location) {

        $scope.bestScore = localStorageSrv.getBestScore();
                
        $scope.getSound = function(){
          return settingsSrv.getSound() ? 'ON': 'Off';
        }
        $scope.setSound = function(){ 
          settingsSrv.getSound() ? settingsSrv.setSound(false): settingsSrv.setSound(true);
        }

        $scope.play = function(){
          $location.path('/difficulty');
        }
        
        $scope.highScores = function(){
          $location.path('/scores');
        }

        $scope.badges = function(){
           $location.path('/badges');
        }

      }]);
});