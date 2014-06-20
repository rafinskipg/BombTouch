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
            text: 'Complete the level 1'
          },
          {
            name: 'level2',
            alias: '',
            text: 'Complete the level 2'
          },
          {
            name: 'level3',
            alias: '',
            text: 'Complete the level 3'
          },
          {
            name: 'level4',
            alias: '',
            text: 'Complete the level 4'
          },
          {
            name: 'level5',
            alias: '',
            text: 'Complete the level 5'
          },
          {
            name: 'level1_stage1',
            alias: '',
            text: 'Junk Warrior'
          },
          {
            name: 'level1_stage2',
            alias: '',
            text: 'Rat killer'
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
            text: 'Kill everything on a level!'
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

    function checkIfWonBadges( state, level ){
      var completed = localStorageSrv.getCompletedBadges();
      var gameTotals = localStorageSrv.getTotals();
      var newBadges = [];
      var possibleBadges = [];

      //TODO : Check if we have all the levels badges to win the completion one.
      if(state.win){
        possibleBadges.push('level'+level);
      }

      if(state.died){
        possibleBadges.push('died');
      }

      var totalEnemiesKilled = 0;
      var chaos = true;
      state.levelsInfo.stages.map(function(stage, index){
        if(stage.completed && stage.total == stage.killed && stage.total > 0){
          //TODO: Check if we use this badges
          possibleBadges.push('level'+level+'_stage'+(index+1));
        }else{
          chaos = false;
        }
        totalEnemiesKilled+=stage.killed;
      })

      if(state.win && chaos){
        possibleBadges.push('chaos');
      }

      gameTotals.bonuses += state.levelsInfo.bonuses.picked ;
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