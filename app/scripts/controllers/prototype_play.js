define(['angular', 'app','game/assets', 'game/loader'], function(angular, BombTouchApp, ASSETSList, LOADER){
    'use strict';
    return BombTouchApp.controller('PrototypePlayCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','$location','badgesSrv',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv, $location,badgesSrv) {
        $scope.puntos = 0;
        $scope.paused = false;
        $scope.megaShootActive = false;

        var theGame;

        $scope.getSound = function(){
          return settingsSrv.getSound();
        }
        $scope.setSoundInGame = function(){ 
          var toSet = settingsSrv.getSound() ? false : true;
          settingsSrv.setSound(toSet);

          theGame.setSoundInGame(toSet);
        }

        $scope.pause = function(){
          $scope.paused = true;
          theGame.pause();
        }
        $scope.resume = function(){
          $scope.paused = false;
          theGame.resume();
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

        function setPrototype(){
          var id = settingsSrv.getPrototype() || 'shield';
          if(id == 'shield'){
            theGame = new SHIELDPROTOTYPE();
          }else if(id == 'rock'){
            theGame = new ROCKPROTOTYPE();
          }
          start();
        }

        function start(){
          $scope.puntos = 0;
          theGame.setSound(settingsSrv.getSound());
          theGame.setDifficulty(1.0);
          //Observer of the game
          theGame.suscribeGameOver(function(gameState, times){
            $location.path('/prototypes');
          });


          theGame.suscribePoints(function(points){
              $scope.puntos = points;
              $scope.$apply();
          });

          theGame.suscribePower(function(power){
            $scope.power = power;
            //TODO applyhere
          });
          theGame.suscribeMessages(function(messages,senders,timeoutMessage,timeoutBetweenMessages){
            showMessages(messages,senders,timeoutMessage,timeoutBetweenMessages);
          });
                    LOADER.init('canvas2');
          LOADER.load(ASSETSList, theGame.start)
        }
        

        setPrototype();

      }]);
});




