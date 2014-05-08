define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('localStorageSrv', ['$http', '$q', function($http, $q) {

    var __APP_NAME = 'nyanspace';
    
    var save = function(data){
      data.lastSync = Date.now();
      localStorage.setItem(__APP_NAME, JSON.stringify(data));0
      //TODO: Post to my server
    }
    var getData = function(){
      var data =  JSON.parse(localStorage.getItem(__APP_NAME));
      if(!data){
        data = {
          maxScore :0,
          lastSync: 0,
          badges : [],
          totals :{
            bonuses: 0,
            kills: 0,
            time: 0
          },
          scores : [],
          games: [],
        };
      }
      if(!data.badges){
        data.badges = [];
      }
      if(!data.scores){
        data.scores = [];
      }
      if(!data.games){
        data.games = [];
      }
      if(!data.lastSync){
        data.lastSync = 0;
      }
      if(!data.totals){
        data.totals = {
          bonuses: 0,
          kills: 0,
          time: 0
        };
      }
      return data;
    }

    var saveLastScore = function(score){
      var data = getData();
      data.scores.push(score);
      save(data);
      saveBestScore(score);
    }

    var saveBestScore = function(score){
      var data = getData();
      var bestScore = parseInt(data.maxScore, 10);
      if(score > bestScore){
        data.maxScore = score;
      }
      save(data);
    }

    var saveGameState = function(gameState){
      var data = getData();
      data.games.push(gameState);
      save(data);
      saveLastScore(gameState.points);
    }

    var saveTotals = function(totals){
      var data = getData();
      data.totals = totals;
      save(data);
    }
    var getBestScore = function(){
      var data = getData();
      return data.maxScore;
    }

    var getLastGameState = function(){
      var data = getData();
      return data.games[data.games.length -1];
    }

    var getScores = function(){
      var data = getData();
      return data.scores;
    }

    var addCompletedBadges = function(listOfBadges){
      var data = getData();
      listOfBadges.map(function(item){
        data.badges.push(item);
      });
      save(data);
    }
    
    var getCompletedBadges = function(){
      var data = getData();
      return data.badges;
    }

    var getTotals = function(){
      var data = getData();
      return data.totals;
    }
    return {
        getData: getData,
        save: save,
        saveBestScore: saveBestScore,
        saveLastScore: saveLastScore,
        saveGameState: saveGameState,
        addCompletedBadges: addCompletedBadges,
        getCompletedBadges: getCompletedBadges,
        getBestScore: getBestScore,
        getLastGameState: getLastGameState,
        getScores: getScores,
        getTotals: getTotals,
        saveTotals: saveTotals
      };
  }]);
});