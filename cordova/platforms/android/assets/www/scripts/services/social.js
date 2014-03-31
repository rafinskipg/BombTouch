define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('socialSrv', ['$http', '$q', function($http, $q) {


    var save = function(command){
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
      if(!commands || !commands.length > 0){
        commands = [];
      }
      return commands;
    }

    return {
        getData: getData,
        save: save
      };
  }]);
});