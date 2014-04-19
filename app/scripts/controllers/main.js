define(['angular', 'app', 'maingame'], function(angular, BombTouchApp , GAME){
    'use strict';
    return BombTouchApp.controller('MainCtrl',['$scope', '$timeout', 'socialSrv', 'localStorageSrv',function ($scope, $timeout,socialSrv, localStorageSrv) {
        $scope.home = true;
        $scope.juego = false;
        $scope.puntos = 0;
        $scope.gameOver = false;
        $scope.paused = false;
        $scope.megaShootActive = false;
        var booleanSonido = true;

        $scope.isMobile = window.isMobile ? true : false;
        $scope.bestScore = localStorageSrv.getBestScore();
        
        $scope.getSonido = function(){
            return booleanSonido == true ? 'ON' : 'OFF';
        }
        $scope.setSonido = function(){ 
            GAME.setSound(booleanSonido = (booleanSonido == true ? false : true));
        }
        $scope.setSoundInGame = function(){ 
            GAME.setSoundInGame(booleanSonido = (booleanSonido == true ? false : true));
        }
        
        $scope.shoot = function(){
            GAME.shoot();
        }

        $scope.start = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          GAME.start();
        } 

        $scope.restart = function(){
          $scope.home = false;
          $scope.juego = true; 
          $scope.puntos = 0;
          $scope.gameOver = false;
          GAME.restart();
        }

        $scope.pause = function(){
            $scope.paused = true;
            GAME.pause();
        }
        $scope.resume = function(){
            $scope.paused = false;
            GAME.resume();
        }
        //Message for levels
        function showLevel(level){
            $scope.level = level;
            $scope.showLevel = true;
            $timeout( function(){
                $scope.showLevel = false;
            },1500)
        }

        $scope.megaShoot = function(){
            GAME.megaShoot();
        }
        //Observer of the game
        GAME.suscribeGameOver(function(){
            $scope.gameOver = true;
            $scope.$apply();
            localStorageSrv.saveBestScore($scope.puntos);
        });

        GAME.suscribePoints(function(points){
            $scope.puntos = points;
            $scope.$apply();
        });

        GAME.suscribePower(function(power){
            $scope.power = power;
            if(power == 100){
                $scope.megaShootActive = true;
            }else{
                $scope.megaShootActive = false;
            }
            //TODO applyhere
        });

        GAME.suscribeLevelUp(function(level){
            showLevel(level);
        });

      }]);
});




