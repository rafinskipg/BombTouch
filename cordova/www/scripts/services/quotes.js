define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('quotesSrv', ['$http', '$q', function($http, $q) {

    function getQuote(){
      var dfd = $q.defer();
      $http.get('http://api.icndb.com/jokes/random')
        .then(function(response){
          console.log(response.data);
          dfd.resolve(response.data.value.joke);
        }).catch(function(err){
          dfd.resolve("My mamma is so fat even ")
        })

      return dfd.promise
    }

    return {
        getQuote: getQuote
      };
  }]);
});