define(['angular', 'app',], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('MusicController',
      ['$scope', '$timeout','settingsSrv','$location',
      function ($scope, $timeout,settingsSrv, $location) {

        $scope.songName = 'Nothing';
        $scope.musicPlaying = false;
        var songIndex = 0;
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
       
        $scope.playSong = function(){
          songs[songIndex].song.play();
          $scope.songName = songs[songIndex].name;
          $scope.musicPlaying = true;
        }
 
        $scope.pauseSong = function(){
          songs[songIndex].song.pause();
          $scope.musicPlaying = false;
        }

        $scope.nextSong = function(){
          songs[songIndex].song.stop();
          songIndex++;
          songIndex = songIndex > songs.length - 1 ?  0 : songIndex;
          $scope.playSong();
        }

        $scope.prevSong = function(){
          songs[songIndex].song.stop();
          songIndex--;
          songIndex = songIndex < 0 ? songs.length - 1  : songIndex;
          $scope.playSong();
        }


        $scope.getSound = function(){
          return settingsSrv.getSound();
        }

        if($scope.getSound()){
          $scope.playSong();
        }

      }]);
});




