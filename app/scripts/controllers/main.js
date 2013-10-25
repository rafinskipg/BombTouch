define(['angular', 'app', 'maingame'], function(angular, myApp , GAME){
    'use strict';
    return myApp.controller('MainCtrl', function ($scope) {
        $scope.home = true;
        $scope.juego = false;
        var puntos = 0;
        var booleanSonido = true;
        
        
        $scope.getSonido = function(){
            return booleanSonido == true ? 'ON' : 'OFF';
        }
        $scope.setSonido = function(){ 
            GAME.setSound(booleanSonido = (booleanSonido == true ? false : true));
        }
        $scope.getPuntos = function(){
            console.log(GAME.getPoints());
            return GAME.getPoints();;
        }
        $scope.start = function(){
            $scope.home = false;
            $scope.juego = true; 
            GAME.start();
        }
        $scope.isGameOver = function(){
            console.log(GAME.isGameOver());
            return GAME.isGameOver();
        }
        
        
      });
});




