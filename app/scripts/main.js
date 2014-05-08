requirejs.config({
    baseUrl: 'scripts',
    paths: {
        angular : '../bower_components/angular/angular',
        maingame : 'game/app',
        input : 'game/input',
        resources : 'game/resources',
        sprite : 'game/sprite',
        ngresource : '../bower_components/angular-resource/angular-resource',
        ngcookies : '../bower_components/angular-cookies/angular-cookies',
        ngsanitize : '../bower_components/angular-sanitize/angular-sanitize',
        ngroute : '../bower_components/angular-route/angular-route',
        howler : '../bower_components/howler/howler.min',
        fastclick: '../bower_components/fastclick-amd/fastclick',
       // 'lib/hammer': '../bower_components/hammerjs/hammer.min',
        hu: '../bower_components/hu/hu'
    },
    shim: {
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
            //,
           // deps:['lib/hammer']
        }
    },
	priority: [
		"angular"
	]
});

require( [
	'angular',
	'app',
    'controllers/home',
    'controllers/main',
    'controllers/gameover',
    'controllers/scores',
    'controllers/badges',
    'services/social',
    'services/localStorage',
    'services/settings',
    'services/badges',
    'services/quotes',
    'routes',
    'howler',
    'fastclick'
], function(angular, app) {
	'use strict';

    document.addEventListener( "DOMContentLoaded", function(){
        document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
            
    }, false );
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