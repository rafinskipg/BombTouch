define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('PrototypesCtrl',
      ['$scope', 'settingsSrv', '$location',
      function ($scope, settingsSrv, $location) {

        $scope.prototypes = [
          {
            name : 'Shield Prototype',
            id: 'shield'
          }
        ];


        $scope.goToPrototype = function(prototype){
          settingsSrv.setPrototype(prototype.id);
          $location.path('/prototype_play');
        }
        
        $scope.goHome  = function(){
          $location.path("/");
        }
      }]);
});