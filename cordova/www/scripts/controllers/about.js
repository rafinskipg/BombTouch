define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('AboutCtrl',
      ['$scope', 'settingsSrv', '$location',
      function ($scope, settingsSrv, $location) {
        
        $scope.goHome  = function(){
          $location.path("/");
        }
      }]);
});