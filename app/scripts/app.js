define([
	'angular','fastclick'
	], function (angular, FastClick ) {
		'use strict';

    document.addEventListener('deviceready', init, false);

    function init(){
      window.isMobile = true;
    }

    var BombTouchApp = angular.module('BombTouchApp', ['ngRoute']).run(function() {
	    FastClick.attach(document.body);
	  }) ;
		return BombTouchApp;
});