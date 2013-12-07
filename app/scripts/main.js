requirejs.config({
    
    paths: {
        angular : '../bower_components/angular/angular',
        jquery : '../bower_components/jquery/jquery',
        maingame : 'game/app',
        input : 'game/input',
        resources : 'game/resources',
        sprite : 'game/sprite',
        jqmobile : 'game/jquery.mobile.custom.min',
        ngresource : '../bower_components/angular-resource/angular-resource',
        ngcookies : '../bower_components/angular-cookies/angular-cookies',
        ngsanitize : '../bower_components/angular-sanitize/angular-sanitize',
        ngroute : '../bower_components/angular-route/angular-route'
        
    },
    shim: {
        jquery: {
            exports: 'jquery'
        },
        jqmobile: {
            deps: ['jquery']
        },
		angular: {
			exports: 'angular'
		},
        ngroute:{
            deps:['angular']
        },
        'app':{
            deps: ['angular', 'ngroute'],
            exports: 'BombTouchApp'
        },
        'controllers/main':{
            deps: ['app']
        },
        'routes':{
            deps: ['app' ]
        },
        maingame : {
            exports: 'GAME'
        }
    },
	priority: [
		"angular"
	]
});

require( [
	'angular',
	'jquery',
	'app',
    'controllers/main',
    'routes'
], function(angular, $, app) {
	'use strict';
    $(document).ready(function(){

        var $html = angular.element(document.getElementsByTagName('html')[0]);

        angular.element().ready(function() {
            $html.addClass('ng-app');
            angular.bootstrap($html, [app['name']]);
            angular.module('exceptionOverride', []).factory('$exceptionHandler', function () {
              return function (exception, cause) {
                exception.message += ' (caused by "' + cause + '")';
                throw exception;
              };
            });
        });
        
    });
	
});