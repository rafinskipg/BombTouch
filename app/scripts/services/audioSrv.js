define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('audioSrv', ['$http', '$q',  function($http, $q) {

    var songs = [
        {
          name :'howl',
          song: new Howl({
            urls: ['sounds/cut_grunt2.wav'],
            volume: 0.2
          })
        },
        {
          name: 'laser',
          song: new Howl({
            urls: ['sounds/laser5.wav'],
            volume: 0.1
          })
        },
        {
          name : 'SEYYYssda',
          song: new Howl({
            urls: ['sounds/songs/thiaz_itch_bubblin_pipe.mp3'],
            volume: 0.5,
            loop: true
          })
        }
      ];
    
    function getSongs(){
      return songs;
    }

    function playSong(index){
      songs[index].song.play();
      return songs[index].name;
    }
    function stopSong(index){
      songs[index].song.stop();
    }
    function pauseSong(index){
      songs[index].song.pause();
    }

    function stopSounds (){
      songs.map(function(item){
        item.song.stop();
      })
    }
    return {
        playSong: playSong,
        stopSong: stopSong,
        pauseSong: pauseSong,
        stopSounds: stopSounds,
        getSongs: getSongs
      };
  }]);
});