define(['angular', 'app', 'maingame','game/artscenes/scene_intro', 'game/loader'], function(angular, BombTouchApp  , GAME, sceneIntro,LOADER){
    'use strict';
    return BombTouchApp.controller('MainCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','audioSrv','$location','badgesSrv',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv,audioSrv, $location,badgesSrv) {
        $scope.puntos = 0;
        $scope.paused = false;
        $scope.megaShootActive = false;

        var theGame = new GAME();

        $scope.getSound = function(){
          return settingsSrv.getSound();
        }

        $scope.setSoundInGame = function(){ 
          var toSet = settingsSrv.getSound() ? false : true;
          settingsSrv.setSound(toSet);
          if(toSet == false){
            audioSrv.pauseSong();
          }else{
            audioSrv.playSong();
          }
          theGame.setSoundInGame(toSet);
        }

        $scope.start = function(){
          $scope.puntos = 0;
          theGame.setSound(settingsSrv.getSound());
          theGame.setDifficulty(settingsSrv.getDifficulty());
          sceneIntro.init( 'canvas', theGame.start);
        } 

        $scope.pause = function(){
          $scope.paused = true;
          audioSrv.pauseSong();
          theGame.pause();
        }
        $scope.resume = function(){
          $scope.paused = false;
          audioSrv.playSong();
          theGame.resume();
        }

        $scope.showMenu = function(){
          $scope.menuVisible = true;
        }
        $scope.hideMenu = function(){
          $scope.menuVisible = false;
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
        theGame.suscribeGameOver(function(gameState, times){
          gameState.times = times;
          gameState.newBadges = badgesSrv.checkIfWonBadges(gameState);
          localStorageSrv.saveGameState(gameState);
          audioSrv.stopSounds();
          $location.path('/gameover');
        });

        theGame.suscribePoints(function(points){
            $scope.puntos = points;
            $scope.$apply();
        });

        theGame.suscribeMessages(function(messages,timeoutMessage,type){
          $scope.messsagesType = type;
          showMessages(messages,timeoutMessage);
        });

        theGame.suscribePower(function(power){
            $scope.power = power;
            //TODO applyhere
        });

        $scope.start();

      }]);
});




