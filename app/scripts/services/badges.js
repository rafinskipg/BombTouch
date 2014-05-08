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
            name: 'level2',
            alias: '',
            text: 'Kill all the level 2 monsters'
          },
          {
            name: 'level3',
            alias: '',
            text: 'Kill all the level 3 monsters'
          },
          {
            name: 'level4',
            alias: '',
            text: 'Kill all the level 4 monsters'
          },
          {
            name: 'level5',
            alias: '',
            text: 'Kill all the level 5 monsters'
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
          },{
            name: 'died',
            alias: '',
            text: 'Died sometime...'
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
      var chaos = true;
      state.enemiesInformation.levels.map(function(level, index){
        if(level.completed && level.total == level.killed && level.total > 0){
          possibleBadges.push('level'+(index+1));
        }else{
          chaos = false;
        }
        totalEnemiesKilled+=level.killed;
      })

      if(state.win && chaos){
        possibleBadges.push('chaos');
      }

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