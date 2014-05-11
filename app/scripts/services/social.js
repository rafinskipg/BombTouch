define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('socialSrv', ['$http', '$q', function($http, $q) {


    var share = function(text){
      if(window.isMobile){
        var message = {
          url: 'http://ns4007672.ip-192-95-30.net:9000',
          image: 'http://ns4007672.ip-192-95-30.net:9000/images/logo.png',
          text:text
        };
        window.socialmessage.send(message);  
      }else{
        var width  = 575,
        height = 400,
        left   = 500 / 2,
        top    = 300 / 2,
        url    = 'https://play.google.com/store/apps/details?id=com.rafinskipg.gitella',
         opts   = 'status=1' +
             ',width='  + width  +
             ',height=' + height +
             ',top='    + top    +
             ',left='   + left;

        window.open('http://www.facebook.com/sharer.php?s=100&title=Nyan Cat adventures&summary=heyy&p[url]=http://ns4007672.ip-192-95-30.net:9000', 'twitter', opts);
      }
      
    }

    return {
        share: share
      };
  }]);
});