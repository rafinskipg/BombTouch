define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('settingsSrv', ['$http', '$q', function($http, $q) {

    var soundEnabled = true;
    var difficulty;

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
    return {
        getSound: getSound,
        setSound: setSound,
        setDifficulty: setDifficulty,
        getDifficulty: getDifficulty
      };
  }]);
});