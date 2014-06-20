define(['angular', 'app', 'game/artscenes/scene_intro','game/levels/jokeLevel', 'maingame','services/settings'], function(angular, BombTouchApp, sceneIntro, jokeLevel){
    'use strict';
  return BombTouchApp.
    factory('gameSrv', ['settingsSrv', 'brainSrv', function( settingsSrv, brainSrv) {

    /* This service acts as a manager, getting all the suscriptions and using them in each level **/

    var suscribersPoints = {};
    var suscribersMessages = {};
    var suscribersGameOver = {};
    var suscribersGameStart = {};
    var game;

    function suscribe(fn, name, map){
      map[name] = fn;
    }
    function notify(map, params){
      for(var obj in map){
        map[obj](params);
      }
    }
    function suscribePoints(fn, name){
      suscribe(fn,name,suscribersPoints);
    }
    function suscribeGameOver(fn, name){
      suscribe(fn,name,suscribersGameOver);
    }
    function suscribeMessages(fn, name){
      suscribe(fn,name,suscribersMessages);
    }
    function suscribeGameStart(fn, name){
      suscribe(fn,name,suscribersGameStart);
    }

    function getCurrentLevel(){
      var level = settingsSrv.getLevel();
      console.log(level)
      if(level == 1.0){
        return jokeLevel;
      }else{
        debugger;
      }
    }

    function reset(){
      game = new brainSrv();
      game.suscribeMessages(function(messages,timeoutMessage,type){
        notify(suscribersMessages, {
          messages: messages,
          tiemoutMessage: timeoutMessage, 
          type: type
        })
      });
      game.suscribePoints(function(points){
        notify(suscribersPoints, points);
      });
      game.suscribeGameOver(function(gameState, times){
        notify(suscribersGameOver, {
          gameState: gameState,
          times: times
        });
      });
    }

    function play(canvasId){
      reset();
      sceneIntro.init(canvasId, function(){
        game.start(getCurrentLevel());
        notify(suscribersGameStart, 'started');
      } );
    }

    function pause(){
      game.pause();
    }

    function resume(){
      game.resume();
    }

    return {
        play: play,
        pause: pause,
        resume: resume,
        suscribePoints: suscribePoints,
        suscribeGameOver: suscribeGameOver,
        suscribeMessages: suscribeMessages,
        suscribeGameStart: suscribeGameStart,
      };
  }]);
});