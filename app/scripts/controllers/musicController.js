define(['angular', 'app',], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('MusicController',
      ['$scope', '$timeout','settingsSrv','$location','audioSrv',
      function ($scope, $timeout,settingsSrv, $location, audioSrv) {

        $scope.songName = 'Nothing';
        $scope.musicPlaying = false;
        var songIndex = 0;
        var songs = audioSrv.getSongs();
       
        $scope.playSong = function(){
          var name = audioSrv.playSong(songIndex);
          $scope.songName = name;
          $scope.musicPlaying = true;
        }
 
        $scope.pauseSong = function(){
          audioSrv.stopSong(songIndex);
          $scope.musicPlaying = false;
        }

        $scope.nextSong = function(){
          audioSrv.stopSong(songIndex);
          songIndex++;
          songIndex = songIndex > songs.length - 1 ?  0 : songIndex;
          $scope.playSong();
        }

        $scope.prevSong = function(){
          audioSrv.stopSong(songIndex);
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




