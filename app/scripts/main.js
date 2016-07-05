requirejs.config({
  baseUrl: 'scripts',
  paths: {
    angular : '../bower_components/angular/angular',
    maingame : 'game/app',
    levelsDirector : 'game/levelsDirector',
    input : 'game/userInput/input',
    resources : 'game/loader/resources',
    sprite : 'game/sprite',
    petra : 'game/utils/petra',
    raf : 'game/utils/raf',
    quad_tree : 'game/utils/QuadTree',
    ngresource : '../bower_components/angular-resource/angular-resource',
    ngcookies : '../bower_components/angular-cookies/angular-cookies',
    ngsanitize : '../bower_components/angular-sanitize/angular-sanitize',
    ngroute : '../bower_components/angular-route/angular-route',
    howler : '../bower_components/howler/howler.min',
    fastclick: '../bower_components/fastclick-amd/fastclick',
    scroll_reveal: '../bower_components/scrollreveal/dist/scrollReveal.min',
    px_loader: '../bower_components/PxLoaderNoDependencies/PxLoader',
    px_loader_audio: '../bower_components/PxLoaderNoDependencies/PxLoaderAudio',
    px_loader_image: '../bower_components/PxLoaderNoDependencies/PxLoaderImage',
    px_loader_sound: '../bower_components/PxLoaderNoDependencies/PxLoaderSound',
   // 'lib/hammer': '../bower_components/hammerjs/hammer.min',
    hu: '../bower_components/hu/hu'
  },
  shim: {
    angular: {
  	 exports: 'angular'
    },
    'ngsanitize':{
      exports: 'ngSanitize'
    },
    ngroute:{
      deps:['angular']
    },
    px_loader_audio:{
      deps:['px_loader']
    },
    px_loader_image:{
      deps:['px_loader']
    },
    fox_ng_scroll_reveal:{
      depts:['scroll_reveal']
    },
    'app':{
      deps: ['angular', 'ngroute','scroll_reveal'],
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
  'directives/onFinishRender',
  'controllers/home',
  'controllers/main',
  'controllers/musicController',
  'controllers/gameover',
  'controllers/scores',
  'controllers/badges',
  'services/social',
  'services/localStorage',
  'services/settings',
  'services/audioSrv',
  'services/badges',
  'services/quotes',
  'routes',
  'howler',
  'fastclick',
  'scroll_reveal'
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