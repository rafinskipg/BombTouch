define(['angular', 'app', 'maingame','petra'], function(angular, BombTouchApp , GAME, petra){
    'use strict';
    BombTouchApp.filter('reverse', function() {
      return function(items) {
        return items.slice().reverse();
      };
    });

    return BombTouchApp.controller('ScoresCtrl',
      ['$scope', 'localStorageSrv','$location', 'socialSrv',
      function ($scope,  localStorageSrv, $location, socialSrv) {
        
        $scope.isMobile = window.isMobile ? true : false;
        $scope.bestScore = localStorageSrv.getBestScore();
        $scope.totals = localStorageSrv.getTotals();
        var scores = localStorageSrv.getScores();

        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          window.scrollSuperReveal = new scrollReveal({reset: true});  
        });

        var posibleEntrances = [
          'enter top over 3s after 0.5s',
          'enter right after 0.5s',
          'enter top over 0.5s and move 200px',
          'enter bottom over 1s and move 100px',
          'enter left',
          'enter right after 0.5s',
          'enter bottom over 1s and move 300px after 0.3s',
          'enter bottom over 1s and move 100px'
        ];

        function getIcon(score){
          if(score < 500 && score > 0){
            return 'fa fa-bug';
          }else if(score >= 500 && score < 1000){
            return 'fa fa-frown-o'
          }else if(score >= 1000 && score < 2000){
            return 'fa fa-cab'
          }else if(score >= 2000 && score < 3000){
            return 'fa fa-graduation-cap'
          }else if(score >= 3000 && score < 4000){
            return 'fa fa-bomb'
          }else if(score >= 4000 && score < 6000){
            return 'fa fa-flash'
          }else if(score >= 6000 && score < 9000){
            return 'fa fa-gavel'
          }else if(score >= 9000 && score < 15000){
            return 'fa fa-space-shuttle'
          }else if(score >= 15000){
            return 'fa fa-beer'
          }else{
            return 'fa fa-thumbs-down';
          }
        }

        $scope.scores = scores.map(function(score){
          return {
            score: score,
            revealOptions: petra.getRandomElementFromArray(posibleEntrances),
            icon: getIcon(score)
          }
        });

        $scope.goHome  = function(){
          $location.path("/");
        }

        $scope.share = function(){
          socialSrv.share('My best score, on the Cool Dog game... :D '+ $scope.bestScore+' points!');
        }

        $scope.identity = angular.identity;
      }]);
});
