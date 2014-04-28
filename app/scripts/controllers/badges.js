define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('BadgesCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv) {
        $scope.completedBadges = localStorageSrv.getCompletedBadges();

        $scope.badges = [
          {
            name: 'thegame',
            alias: '',
            text: 'Complete the game'
          },
          {
            name: 'level1',
            alias: '',
            text: 'Kill all the level 1 monsters'
          }
        ]
      }]);
});
