define(['angular', 'app', 'game/prototypes/shield','game/loader'], function(angular, BombTouchApp , SHIELDPROTOTYPE, LOADER){
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
            prototypeShield();
          }
        }
        function prototypeShield(){
          $scope.puntos = 0;
          theGame = new SHIELDPROTOTYPE();
          theGame.setSound(settingsSrv.getSound());
          theGame.setDifficulty(1.0);
          start();
        } 

        function start(){
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
        

        setPrototype();

      }]);
});




