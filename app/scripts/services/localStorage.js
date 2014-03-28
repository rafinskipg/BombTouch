define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('localStorageSrv', ['$http', '$q', function($http, $q) {


    var save = function(data){
      var commandsSaved = getLocals(); 
      if(command.checked){
        commandsSaved.push(command.id);
      }else{
        itemsFound = commandsSaved.filter(function(com){
          return com != command.id;
        });
        console.log(itemsFound);
        commandsSaved = itemsFound;
      }
      saveLocals(commandsSaved);
      
    }
    var saveLocals = function(locals){
      localStorage.setItem("gitella", JSON.stringify(locals));
    }
    var getData = function(){
      var commands =  JSON.parse(localStorage.getItem("nyanspace"));
      if(!commands){
        commands = {
          maxScore :0
        };
      }
      return commands;
    }

    var saveBestScore = function(score){
      var data = getData();
      var bestScore = parseInt(data.maxScore, 10);
      if(score > bestScore){
        data.maxScore = score;
      }
      saveLocals(data);
    }
    var getBestScore = function(){
      var data = getData();
      return data.maxScore;
    }

    return {
        getData: getData,
        save: save,
        saveBestScore: saveBestScore,
        getBestScore: getBestScore
      };
  }]);
});