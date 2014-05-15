
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }else if( (/(\.mp4|\.mp3|\.ogg|\.wav)/).test(url) ){
            var audio = new Audio();
            audio.addEventListener('canplaythrough',  function() {
                resourceCache[url] = audio;
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            }, false); // It works!!
            
            resourceCache[url] = false;
            audio.src = url;
        }else{
            var img = new Image();
            resourceCache[url] = false;
         
            img.onload = function() {
                resourceCache[url] = img;
                
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = { 
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();