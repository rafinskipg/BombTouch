define(['angular', 'app',], function(angular, BombTouchApp){
    'use strict';
    return BombTouchApp.controller('MusicController',
      ['$scope', '$timeout','settingsSrv','$location','audioSrv',
      function ($scope, $timeout,settingsSrv, $location, audioSrv) {

        $scope.songName = 'Nothing';
        $scope.musicPlaying = false;
       
        $scope.playSong = function(){
          audioSrv.playSong();
          $scope.musicPlaying = true;
        }
 
        $scope.pauseSong = function(){
          audioSrv.pauseSong();
          $scope.musicPlaying = false;
        }

        $scope.nextSong = function(){
          audioSrv.stopSong();
          audioSrv.nextSong();
        }

        $scope.prevSong = function(){
          audioSrv.stopSong();
          $scope.playSong();
        }


        $scope.getSound = function(){
          return settingsSrv.getSound();
        }

        audioSrv.suscribeChangeSong(function(songName){
          $scope.songName = songName;
        });

        if($scope.getSound()){
          $scope.playSong();
        }

      }]);
});




