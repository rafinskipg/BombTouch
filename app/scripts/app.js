define([
	'angular','fastclick'
	], function (angular, FastClick ) {
		'use strict';

        var BombTouchApp = angular.module('BombTouchApp', ['ngRoute']).run(function() {
			    FastClick.attach(document.body);
			  }) ;
		return BombTouchApp;
});