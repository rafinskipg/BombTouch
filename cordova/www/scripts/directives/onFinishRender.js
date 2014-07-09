define(['angular', 'app'], function(angular, BombTouchApp ){
  'use strict';

  return BombTouchApp.directive('onFinishRender', ['$timeout',function ($timeout) {
    return {
        restrict: 'AE',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
  }]);

});
