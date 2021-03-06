
(function() {
    function Sprite(url, pos, size, speed, frames,lookingLeft, dir, once) {
        this.pos = pos;
        this.lookingLeft = lookingLeft;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this.expectedSize = [this.size[0],this.size[1]];
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.setFrameChangeCallback = (function(cb){
            this.frameChangeCallback = cb;
        }).bind(this);
        this.frameChangeCallback = function(){}
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },
        getSize:function(){
            return this.expectedSize;
        },
        resize: function(width, height){
            this.expectedSize = [width,height];
        },
        reset: function(){
            this._index = 0;
        },
        setEndCallback: function(cb){
            this.endCb = cb;
        },
        render: function(ctx,angle, translation, centerOfRotation, transparency) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                var arrayIndex = idx % max;
                frame = this.frames[arrayIndex];

                this.frameChangeCallback(frame,arrayIndex);
                
                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }else if(idx >= max && this.endCb){
                    this.reset();
                    this.endCb();
                }
            }
            else {
                frame = 0;
            }


            var x = this.pos[0];
            var y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }


            var origX = 0;
            var origY = 0;
            
             if(translation){
                ctx.translate(-translation[0],  -translation[1])  
            }
            if(angle){  
                ctx.translate(centerOfRotation[0], centerOfRotation[1])  
                angle = this.lookingLeft ? angle - Math.PI : angle; 
                ctx.rotate((angle)); 
                ctx.translate(-centerOfRotation[0], -centerOfRotation[1]);  
            }

            if(transparency){
                ctx.globalAlpha = transparency;
            }else{
                ctx.globalAlpha = 1.0;
            }

            ctx.drawImage(resources.get(this.url),
                        Math.round(x),  Math.round(y),
                          this.size[0], this.size[1],
                          origX, origY,
                          this.expectedSize[0], this.expectedSize[1]);
        }
    };

    window.Sprite = Sprite;
})();