  /****************************
  ****************************
    Cross browser animation frame
  ****************************
  ****************************/
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
    //Warm up the function
    var id = requestAnimationFrame(function(){});
    cancelAnimationFrame(id);
}());


// performance.now polyfill
// measure time with now()
function polyFillPerfNow() {
    window.performance = window.performance ? window.performance : {};
    window.performance.now = window.performance.now || window.performance.webkitNow || window.performance.msNow || window.performance.mozNow || Date.now;
    window.now = window.performance.now.bind(performance);
    // warm up the function, fooling the interpreter not to skip;
    var a = now();
    a += now();
    return a;
};

// ! requires (window.)now() to be defined. 
// inject startCW() and stopCW() to get a stop watch using
// performace.now. call with a factor to use another unit 
//   (1e3 -> ns ; 1e-3 -> s )
// use with :
//   startCW();
//   // ... the thing i want to measure
//   stopCW();  
//   console.log(lastCW());
// or you can store in a var the result of stopCW(), but do not
// use console.log(stopCW()); for consistant results.
function injectMeasure(factor) {
    var startTime = 0;
    var stopTime = 0;
    factor = factor | 1;

    window.startCW = function () {
        startTime = now();
        return startTime;
    };
    window.stopCW = function () {
        stopTime = now();
        return factor * (stopTime - startTime);
    };
    window.lastCW = function () {
        return factor * (stopTime - startTime);
    };
    // warming up the functions, 
    // fooling the interpreter not to skip;
    var w = 0;
    w = startCW();
    w += startCW();
    w += stopCW();
    w += stopCW();
    w += lastCW();
    return w;
}

polyFillPerfNow();
injectMeasure();