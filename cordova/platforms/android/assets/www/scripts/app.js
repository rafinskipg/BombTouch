define([
  'angular',
  'fastclick'
], function (angular, FastClick) {
  'use strict';
  document.addEventListener('deviceready', function () {
    if (navigator.notification) {
      // Override default HTML alert with native dialog
      window.isMobile = true;
      window.alert = function (message) {
        navigator.notification.alert(message, null, 'The Nyan Cat Adventures', 'OK');
      };
    }
  }, false);
  var BombTouchApp = angular.module('BombTouchApp', ['ngRoute']).run(function () {
      FastClick.attach(document.body);
    });
  return BombTouchApp;
});