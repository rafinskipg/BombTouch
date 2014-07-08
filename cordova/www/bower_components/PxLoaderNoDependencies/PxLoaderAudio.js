/*global PxLoader: true, define: true, Audio: true */ 

// PxLoader plugin to load audio elements
function PxLoaderAudio(url, tags, priority) {
    var self = this;
    var loader = null;

    this.readyEventName = 'canplaythrough';

    try {
        this.audio = new Audio();
    } catch(e) {
        this.audio = document.createElement('audio');
    }

    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.audio.readyState !== 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    var onLoad = function() {
        removeEventHandlers();
        loader.onLoad(self);
    };

    var onError = function() {
        removeEventHandlers();
        loader.onError(self);
    };

    var removeEventHandlers = function() {
        self.unbind('load', onLoad);
        self.unbind(self.readyEventName, onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an Audio is in the cache.
        self.bind('load', onLoad);
        self.bind(self.readyEventName, onReadyStateChange);
        self.bind('error', onError);

        // sometimes the browser will intentionally stop downloading
        // the Audio. In that case we'll consider the Audio loaded
        self.bind('suspend', onLoad);

        self.audio.src = url;
        self.audio.load();
    };

    // called by PxLoader to check status of Audio (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        if (self.audio.readyState !== 4) {
            return;
        }

        removeEventHandlers();
        loader.onLoad(self);
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        removeEventHandlers();
        if (self.audio.readyState !== 4) {
            loader.onLoad(self);
        } else {
            loader.onTimeout(self);
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        if (self.audio.addEventListener) {
            self.audio.addEventListener(eventName, eventHandler, false);
        } else if (self.audio.attachEvent) {
            self.audio.attachEvent('on' + eventName, eventHandler);
        }
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        if (self.audio.removeEventListener) {
            self.audio.removeEventListener(eventName, eventHandler, false);
        } else if (self.audio.detachEvent) {
            self.audio.detachEvent('on' + eventName, eventHandler);
        }
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addAudio = function(url, tags, priority) {
    var audioLoader = new PxLoaderAudio(url, tags, priority);
    this.add(audioLoader);

    // return the audio element to the caller
    return audioLoader.audio;
};

// AMD module support
if (typeof define === 'function' && define.amd) {
    define('PxLoaderAudio', [], function() {
        return PxLoaderAudio;
    });
}