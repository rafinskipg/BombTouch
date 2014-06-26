define(['angular', 'app'], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('MainCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','gameSrv','$location','badgesSrv',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv,gameSrv, $location,badgesSrv) {
        $scope.puntos = 0;
        $scope.paused = false;
        $scope.megaShootActive = false;

        $scope.start = function(){
          gameSrv.play('canvas');
        }

        $scope.exit = function(){
          gameSrv.exit();
          $location.path("/");
        }

        function showMessage(message){
          $scope.message = message.text;
          //TODO use resources.get resource from preloaded items
          $scope.messageSender = message.sender;
        
          $scope.$apply();

          $timeout( function(){
            $scope.message = undefined;
            $scope.messageSender = 'unknown';
          },message.duration)  
        }

        function showMessages(messages, timeoutBetweenMessages){
          var message = messages.shift();
          showMessage(message);

          if(messages.length > 0){
            setTimeout(function() {
              showMessages(messages,timeoutBetweenMessages);
            }, message.duration + timeoutBetweenMessages);
          }
        }

        //Observer of the game
        gameSrv.suscribeGameOver(function(opts){
          opts.gameState.times = opts.times;
          opts.gameState.newBadges = badgesSrv.checkIfWonBadges(opts.gameState, settingsSrv.getLevel());
          localStorageSrv.saveGameState(opts.gameState);
          $location.path('/gameover');
        }, 'main_gameover');

        gameSrv.suscribeMessages(function(opts){
          $scope.messsagesType = opts.type;
          showMessages(opts.messages,opts.timeoutMessage);
        }, 'main_messages');

        
        $scope.start();

      }]);
});




