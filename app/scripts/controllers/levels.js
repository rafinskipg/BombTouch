define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('LevelsCtrl',
      ['$scope', 'settingsSrv', '$location',
      function ($scope, settingsSrv, $location) {

        $scope.levels = [
          {
            name : 'Space Junkyard',
            number: 1,
            cristals_amount: 1,
            cristals_used: 1,
            image: 'space_junk'
          },{
            name : 'Asteroids',
            number: 2,
            cristals_amount: 1,
            cristals_used: 0
          },{
            name : 'Outter system',
            number: 3,
            cristals_amount: 2,
            cristals_used: 0
          },{
            name : 'Slime Nebula',
            number: 4,
            cristals_amount: 2,
            cristals_used: 0
          },{
            name : 'Wormhole',
            number: 5,
            cristals_amount: 3,
            cristals_used: 0
          },{
            name : 'The door is locked',
            number: 6,
            cristals_amount: 6,
            cristals_used: 0
          }
        ];

        $scope.levels = $scope.levels.map(function(level){
          level.cristals = [];
          var cristals_used = level.cristals_used;
          for(var i = 0; i < level.cristals_amount ; i++){
            var cristal =  {
              used: false
            };
            if(cristals_used){
              cristal.used = true;
              cristals_used--;
            }
            level.cristals.push(cristal);
          }
          if(level.cristals_amount == level.cristals_used){
            level.playable = true;
          }
          if(!level.image){
            level.image ='unknown_level';
          }
          return level;
        })

        $scope.setLevel = function(level){
          if(level.cristals_amount == level.cristals_used){
            settingsSrv.setLevel(level.number);
            $location.path('/main');  
          }else{
            alert('No! Warf!! Not done! Warf!');
          }
          
        }
        
        $scope.goHome  = function(){
          $location.path("/");
        }
      }]);
});