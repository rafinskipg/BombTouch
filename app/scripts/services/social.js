define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('socialSrv', ['$http', '$q', function($http, $q) {


    var share = function(text){
      var message = {
          url: 'http://rvpg.me',
          image: 'http://rvpg.me/experiments/bombtouchtouch/images/cat.gif',
          text:text
      };
      window.socialmessage.send(message);
    }

    return {
        share: share
      };
  }]);
});