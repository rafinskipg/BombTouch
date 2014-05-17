define(['angular', 'app', 'maingame','game/loader'], function(angular, BombTouchApp , GAME, LOADER){
    'use strict';
    return BombTouchApp.controller('MainCtrl',
      ['$scope', '$timeout', 'socialSrv', 'localStorageSrv','settingsSrv','$location','badgesSrv',
      function ($scope, $timeout,socialSrv, localStorageSrv,settingsSrv, $location,badgesSrv) {
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

          theGame.setSoundInGame(toSet);
        }

        $scope.start = function(){
          $scope.puntos = 0;
          theGame.setSound(settingsSrv.getSound());
          theGame.setDifficulty(settingsSrv.getDifficulty());
          LOADER.init('canvas2');
          LOADER.load([
              'images/newsprites.png',
              'images/background.png',
              'images/orbes/coin.png',
              'images/enemies/tacnyan.png',
              'images/bonusWeapon.png',
              'images/creeper.png',
              'images/doggy/pixeleddog.png',
              'images/doggy/dog2.png',
              'images/rick/rickrollsprite.png',
              'images/messages/dog.png',
              'images/messages/creeper.png',
              'images/messages/cooldog.png',
              'images/messages/cooldogdamaged.png',
              'images/messages/unknown.png',
              'sounds/cut_grunt2.wav',
              'sounds/laser5.wav',
              'sounds/songs/thiaz_itch_bubblin_pipe.mp3',
              'sounds/oh_yeah_wav_cut.wav',
              'sounds/upmid.wav',
              'sounds/rickcut2.wav',
              'sounds/killer.mp3',
              'sounds/grunt.mp3',
              'sounds/power.mp3',
              'sounds/ohmy.wav',
              'sounds/explosions/atari_boom2.wav',
              'sounds/explosions/explodemini.wav',
              'sounds/explosions/explode.wav'
          ], theGame.start)
          
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

        
        //Observer of the game
        theGame.suscribeGameOver(function(gameState, times){
          gameState.times = times;
          gameState.newBadges = badgesSrv.checkIfWonBadges(gameState);
          localStorageSrv.saveGameState(gameState);
          $location.path('/gameover');
        });

        theGame.suscribePoints(function(points){
            $scope.puntos = points;
            $scope.$apply();
        });

        theGame.suscribeMessages(function(messages,senders,timeoutMessage,timeoutBetweenMessages){
          showMessages(messages,senders,timeoutMessage,timeoutBetweenMessages);
        });

        theGame.suscribePower(function(power){
            $scope.power = power;
            //TODO applyhere
        });

        $scope.start();

      }]);
});




