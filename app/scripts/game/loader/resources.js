define( ['px_loader','px_loader_image','px_loader_audio'], function(){
  (function() {
    var resourceCache = {};
    var loader;
    // Load an image url or an array of image urls
    function load(urlOrArr, cb, progressCb) {
      loader = new PxLoader();
      loader.addImage('/images/pixel.png')
      if(urlOrArr instanceof Array) {
          urlOrArr.forEach(function(url) {
            _load(url);
          });
      }
      else {
          _load(urlOrArr);
      }
      loader.addCompletionListener(cb);
      loader.addProgressListener(function(e) { 
          progressCb(e.completedCount, e.totalCount);
      }); 
      loader.start();
    }

    function _load(url) {
      if(resourceCache[url]) {
        return;
      }else if( (/(\.mp4|\.mp3|\.ogg|\.wav)/).test(url) ){
          resourceCache[url] = loader.addAudio(url);
      }else{
          resourceCache[url] = loader.addImage(url);
      }
    }

    function get(url) {
      return resourceCache[url];
    }

    window.resources = { 
      load: load,
      get: get
    };

  })();

});