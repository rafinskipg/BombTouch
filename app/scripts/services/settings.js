define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('settingsSrv', ['$http', '$q', function($http, $q) {

    var soundEnabled = true;
    var difficulty;
    var prototype;
    var level;

    function getSound(){
      return soundEnabled;
    }

    function setSound(val){
      soundEnabled = val;
    }
    function setDifficulty(val){
      difficulty = val;
    }

    function getDifficulty(){
      return difficulty;
    }   

    function setPrototype(val){
      prototype = val;
    }

    function getPrototype(){
      return prototype;
    }

    function setLevel(val){
      level = val;
    }

    function getLevel(){
      return level;
    }

    return {
        getSound: getSound,
        setSound: setSound,
        setDifficulty: setDifficulty,
        getDifficulty: getDifficulty,
        setPrototype: setPrototype,
        getPrototype: getPrototype,
        setLevel: setLevel,
        getLevel: getLevel

      };
  }]);
});