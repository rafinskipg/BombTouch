define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('LevelsCtrl',
      ['$scope', 'settingsSrv', '$location',
      function ($scope, settingsSrv, $location) {

        $scope.levels = [
          {
            name : 'Space Junkyard',
            number: 1
          },{
            name : 'Asteroids',
            number: 2
          },{
            name : 'Outter system',
            number: 3
          },{
            name : 'Slime Nebula',
            number: 4
          },{
            name : 'Wormhole',
            number: 5
          },{
            name : 'The door is locked',
            number: 6
          }
        ];

        
        $scope.setLevel = function(level){
          settingsSrv.setLevel(level);
          $location.path('/main');
        }
        
        $scope.goHome  = function(){
          $location.path("/");
        }
      }]);
});