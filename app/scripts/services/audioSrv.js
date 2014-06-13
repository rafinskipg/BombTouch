define(['angular', 'app'], function(angular, BombTouchApp ){
    'use strict';
  return BombTouchApp.
    factory('audioSrv', ['$http', '$q',  function($http, $q) {
    var currentSong = 0;
    var suscribers = [];
    var songs = [

        {
          name :'Montego - Reggae',
          song: new Howl({
            urls: ['sounds/songs/montego.mp3'],
            volume: 0.5
          })
        },
        {
          name :'Broken Reality',
          song: new Howl({
            urls: ['sounds/songs/broken_reality.mp3'],
            volume: 0.5
          })
        },
        {
          name: 'Hustle - Blues',
          song: new Howl({
            urls: ['sounds/songs/hustle_blues.mp3'],
            volume: 0.5
          })
        },
        {
          name : 'Thiaz itch : Bubblin pipe',
          song: new Howl({
            urls: ['sounds/songs/thiaz_itch_bubblin_pipe.mp3'],
            volume: 0.5
          })
        },
        {
          name : 'Night of chaos - Horror',
          song: new Howl({
            urls: ['sounds/songs/nightofchaos_horror.mp3'],
            volume: 0.5
          })
        },
        {
          name : 'Retro future dirty - Funk',
          song: new Howl({
            urls: ['sounds/songs/retrofuturedirty_funk.mp3'],
            volume: 0.5
          })
        },
        {
          name : 'Shannon & the Clams - Tired Of being bad - Rockabilly',
          song: new Howl({
            urls: ['sounds/songs/shannon_and_the_clams_tired_of_being_bad_rockabilly.mp3'],
            volume: 0.5
          })
        }
      ];
    
    function getSongs(){
      return songs;
    }

    function getSongIndex(){
      return currentSong;
    }

    function playSong(){
      songs[currentSong].song.play().on('end', function(){
        songs[currentSong].song.off('end');
        currentSong++;
        playSong();
      });
      notifyChangeSong(songs[currentSong].name);
    }
    function stopSong(){
      songs[currentSong].song.stop().off('end');
    }
    function pauseSong(){
      songs[currentSong].song.pause();
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
    return {
        playSong: playSong,
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