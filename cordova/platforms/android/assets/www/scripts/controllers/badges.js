define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
    return BombTouchApp.controller('BadgesCtrl',
      ['$scope','$routeParams', 'localStorageSrv','$location','badgesSrv',
      function ($scope,$routeParams, localStorageSrv, $location, badgesSrv) {
        $scope.completedBadges = localStorageSrv.getCompletedBadges();
        $scope.goHome  = function(){
          $location.path("/");
        }
        $scope.badges = badgesSrv.getBadges();
      }]);
});
