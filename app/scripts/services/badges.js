define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('badgesSrv', ['$http', '$q','localStorageSrv', function($http, $q,localStorageSrv) {

      var allBadges = [
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
        ];

    function getBadges(){
      var completed = localStorageSrv.getCompletedBadges();
      return allBadges.map(function(badge){
        if(completed.indexOf(badge.name) != -1){
          badge.completed = true;
        }
        return badge;
      })
    }

    function checkIfWonBadges( state ){
      var completed = localStorageSrv.getCompletedBadges();
      var gameTotals = localStorageSrv.getTotals();
      var newBadges = [];
      var possibleBadges = [];

      if(state.win){
        possibleBadges.push('complete');
      }

      if(state.died){
        possibleBadges.push('died');
      }

      var totalEnemiesKilled = 0;

      state.enemiesInformation.levels.map(function(level, index){
        if(level.completed && level.total == level.killed){
          possibleBadges.push('level'+(index+1));
        }
        totalEnemiesKilled+=level.killed;
      })

      gameTotals.bonuses += state.bonusesInformation.picked ;
      gameTotals.kills += totalEnemiesKilled;
      
      if(gameTotals.bonuses  >= 25){
        possibleBadges.push('dogs25');
      }
      if(gameTotals.bonuses >= 50){
        possibleBadges.push('dogs50');
      }
      if(gameTotals.bonuses >= 100){
        possibleBadges.push('dogs100');
      }
      if(gameTotals.bonuses >= 100){
        possibleBadges.push('dogs100');
      }

      possibleBadges.map(function(badge){
        if(completed.indexOf(badge) == -1){
          newBadges.push(badge);
        }
      });
      localStorageSrv.saveTotals(gameTotals);
      localStorageSrv.addCompletedBadges(newBadges);
      return newBadges;
    }

    return {
        getBadges: getBadges,
        checkIfWonBadges: checkIfWonBadges
      };
  }]);
});