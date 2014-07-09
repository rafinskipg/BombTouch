define(['angular', 'app', 'game/artscenes/scene_intro','game/levels/jokeLevel', 'game/levels/level_1', 'maingame','services/settings'], function(angular, BombTouchApp, sceneIntro, jokeLevel, level_1){
    'use strict';
  return BombTouchApp.
    factory('gameSrv', ['settingsSrv', 'brainSrv', 'audioSrv', function( settingsSrv, brainSrv, audioSrv) {

    /* This service acts as a manager, getting all the suscriptions and using them in each level **/

    var suscribersPoints = {};
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
    
    function suscribeGameStart(fn, name){
      suscribe(fn,name,suscribersGameStart);
    }

    function getCurrentLevel(){
      var level = settingsSrv.getLevel();
      console.log(level)
      if(level == 1){
        return level_1;
      }else{
        return jokeLevel1;
      }
    }

    function reset(){
      game = new brainSrv();
      
      game.suscribePoints(function(points){
        notify(suscribersPoints, points);
      });
      game.suscribeGameOver(function(gameState, times){
        notify(suscribersGameOver, {
          gameState: gameState,
          times: times
        });
      });

      suscribeGameStart(function(){
        if(settingsSrv.getSound()){
          audioSrv.playSong();
        }
      }, 'gameSrv');

    }

    function play(canvasId){
      reset();
      window.RESIZEFACTOR = 0.4;
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

    function exit(){
      game.pause();
    }

    return {
        play: play,
        pause: pause,
        resume: resume,
        exit: exit,
        suscribePoints: suscribePoints,
        suscribeGameOver: suscribeGameOver,
        suscribeGameStart: suscribeGameStart,
      };
  }]);
});