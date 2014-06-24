define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('settingsSrv', ['$http', '$q', function($http, $q) {

    var soundEnabled = true;
    var difficulty = 1.0;
    var prototype;
    var level = 1.0;

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
      console.log('setting', val)
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