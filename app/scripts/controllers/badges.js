define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('BadgesCtrl',
      ['$scope','$routeParams', '$timeout', 'socialSrv', 'localStorageSrv',
      function ($scope,$routeParams, $timeout,socialSrv, localStorageSrv) {
        $scope.completedBadges = localStorageSrv.getCompletedBadges();

        $scope.badges = [
          {
            name: 'complete',
            alias: '',
            text: 'Complete the game'
          },
          {
            name: 'level1',
            alias: '',
            text: 'Kill all the level 1 monsters'
          },
          {
            name: 'social',
            alias: '',
            text: 'Share your best score'
          },
          {
            name: 'dogs25',
            alias: '',
            text: 'Get 25 doges'
          },
          {
            name: 'dogs50',
            alias: '',
            text: 'Get 50 doges'
          },
          {
            name: 'dogs100',
            alias: '',
            text: 'Get 100 doges'
          },
          {
            name: 'dogs500',
            alias: '',
            text: 'Get 500 doges'
          },
          {
            name: 'chaos',
            alias: '',
            text: 'Kill everything!'
          }
        ]
      }]);
});
