define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('settingsSrv', ['$http', '$q', function($http, $q) {

    var soundEnabled = true;

    function getSound(){
      return soundEnabled;
    }

    function setSound(val){
      soundEnabled = val;
    }
    return {
        getSound: getSound,
        setSound: setSound
      };
  }]);
});