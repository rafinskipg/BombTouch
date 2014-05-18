define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('settingsSrv', ['$http', '$q', function($http, $q) {

    var soundEnabled = true;
    var difficulty;
    var prototype;

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
    return {
        getSound: getSound,
        setSound: setSound,
        setDifficulty: setDifficulty,
        getDifficulty: getDifficulty,
        setPrototype: setPrototype,
        getPrototype: getPrototype
      };
  }]);
});