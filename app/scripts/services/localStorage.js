define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('localStorageSrv', ['$http', '$q', function($http, $q) {

    var __APP_NAME = 'nyanspace';
    
    var save = function(data){
      localStorage.setItem(__APP_NAME, JSON.stringify(data));
    }
    var getData = function(){
      var data =  JSON.parse(localStorage.getItem(__APP_NAME));
      if(!data){
        data = {
          maxScore :0,
          badges : []
        };
      }
      return data;
    }

    var saveBestScore = function(score){
      var data = getData();
      var bestScore = parseInt(data.maxScore, 10);
      if(score > bestScore){
        data.maxScore = score;
      }
      save(data);
    }
    var getBestScore = function(){
      var data = getData();
      return data.maxScore;
    }
    var addBadges = function(listOfBadges){
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
    return {
        getData: getData,
        getCompletedBadges:getCompletedBadges,
        save: save,
        saveBestScore: saveBestScore,
        addBadges: addBadges,
        getBestScore: getBestScore
      };
  }]);
});