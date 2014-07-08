define(['angular', 'app', 'controllers/levels'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('DifficultyCtrl',
      ['$scope', 'settingsSrv', '$location',
      function ($scope, settingsSrv, $location) {

        $scope.difficulties = [
          {
            name : 'easy',
            speed: 0.5
          },{
            name : 'normal',
            speed: 1.0
          },{
            name : 'hard',
            speed: 1.5
          },{
            name : 'veryhard',
            speed: 2.5
          },{
            name : 'ninja',
            speed: 4.0
          },{
            name : 'chucknorris',
            speed: 8.0
          }
        ];


        $scope.setDifficulty = function(difficulty){
          settingsSrv.setDifficulty(difficulty.speed);
          $location.path('/levels');
        }
        
        $scope.goHome  = function(){
          $location.path("/");
        }
      }]);
});