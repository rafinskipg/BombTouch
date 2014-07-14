define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('audioSrv', ['$http', '$q',  function($http, $q) {
    var currentSong = 0;
    var suscribers = [];
    var songs = [
      {
        name :'In Game Concept - Rob Tyler',
        song: new Howl({
          urls: ['sounds/songs/CoolDog_SpaceJunkyard_Full.m4a'],
          volume: 0.5,
          loop: true
        })
      }

      ];
    
    function getSongs(){
      return songs;
    }

    function getSongIndex(){
      return currentSong;
    }

    function playSong(name){

      stopSounds();
      if(songs.length > 0){
        songs[currentSong].song.play();
        notifyChangeSong(songs[currentSong].name);  
      }
      
    }
    function stopSong(){
      if(songs.length > 0){
        songs[currentSong].song.stop().off('end');  
      }
    }
    function pauseSong(){
      if(songs.length > 0){
        songs[currentSong].song.pause();  
      }
    }
    function nextSong(){
      currentSong++;
      currentSong = currentSong > songs.length - 1 ?  0 : currentSong;
      playSong(currentSong);
    }
    function prevSong(){
      currentSong--;
      currentSong = currentSong < 0 ? songs.length - 1  : currentSong;
      playSong(currentSong);
    }
    function stopSounds (){
      songs.map(function(item){
        item.song.stop();
      })
    }

    function notifyChangeSong(name){
      suscribers.map(function(suscriber){
        suscriber(name);
      })
    }

    function suscribeChangeSong(suscriber){
      suscribers.push(suscriber);
    }

    function playSound(sound){
      sound.play();
    }
    return {
        playSong: playSong,
        playSound: playSound,
        stopSong: stopSong,
        pauseSong: pauseSong,
        stopSounds: stopSounds,
        getSongIndex: getSongIndex,
        getSongs: getSongs,
        nextSong: nextSong,
        prevSong: prevSong,
        suscribeChangeSong: suscribeChangeSong
      };
  }]);
});