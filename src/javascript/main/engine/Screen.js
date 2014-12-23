/**
 * Prototype responsible to build the screen.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Screen', 'engine', (function(fn) {
    'use strict';


    fn = function($selector) {
        console.log('[Screen] Creating the screen');
        this.$selector = $selector;

        this.screenWidth = App.Properties.screenWidth;
        this.screenHeight = App.Properties.screenHeight;
        this.screenStrips = [];
        this.stripWidth = App.Properties.stripWidth;
        this.spriteMap = [];
        this.visibleSprites = [];
        this.oldVisibleSprites = [];
    };

    fn.prototype.init = function() {
        var screen = this.$selector.byId('screen');

        for (var i=0; i < this.screenWidth; i += this.stripWidth) {
            var strip = this.$selector.byTag('img');

            strip.style.position = 'absolute';
            strip.style.left = '0px';
            strip.style.height = '0px';

            strip.oldStyles = {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                clip: '',
                src: ''
            };

            this.screenStrips.push(strip);
            screen.appendChild(strip);
        }
    };

    fn.prototype.addObjects = function(map, objs) {
        var mapLength = map.length;

        for (var y=0; y < mapLength; y++) {
            this.spriteMap[y] = [];
        }

        var screen = this.$selector.byId('screen');
        var objsLength = objs.length;

        for (var i=0; i < objsLength; i++) {
            var sprite = objs[i];

            var img = this.$selector.byTag('img');

            img.src = App.Properties.spritesPath + sprite.img;
            img.style.display = "none";
            img.style.position = "absolute";

            sprite.visible = false;
            sprite.block = sprite.block;
            sprite.img = img;

            this.spriteMap[sprite.positionY][sprite.positionX] = sprite;

            screen.appendChild(img);
        }
    };

    fn.prototype.clearObjects = function() {
       // clear the visible sprites array but keep a copy in oldVisibleSprites for later.
       // also mark all the sprites as not visible so they can be added to visibleSprites again during raycasting.
       this.oldVisibleSprites = [];

       for (var i=0; i < this.visibleSprites.length; i++) {
           var sprite = this.visibleSprites[i];
           this.oldVisibleSprites[i] = sprite;
           sprite.visible = false;
       }
       this.visibleSprites = [];
    };

    fn.prototype.renderObjects = function(player, viewDist) {
        var sprite = '';

        for (var i=0; i < this.visibleSprites.length; i++) {
            sprite = this.visibleSprites[i];
            var img = sprite.img;
            img.style.display = "block";

            // translate position to viewer space
            var dx = sprite.positionX + 0.5 - player.x;
            var dy = sprite.positionY + 0.5 - player.y;

            // distance to sprite
            var dist = Math.sqrt(dx*dx + dy*dy);

            // sprite angle relative to viewing angle
            var spriteAngle = Math.atan2(dy, dx) - player.rot;

            // size of the sprite
            var size = viewDist / (Math.cos(spriteAngle) * dist);

            if (size <= 0) continue;

            // x-position on screen
            var x = Math.tan(spriteAngle) * viewDist;

            img.style.left = (this.screenWidth/2 + x - size/2) + "px";

            // y is constant since we keep all sprites at the same height and vertical position
            img.style.top = ((this.screenHeight-size)/2)+"px";

            var dbx = sprite.positionX - player.x;
            var dby = sprite.positionY - player.y;

            img.style.width = size + "px";
            img.style.height =  size + "px";

            var blockDist = dbx*dbx + dby*dby;
            img.style.zIndex = -Math.floor(blockDist*1000);
        }

        // hide the sprites that are no longer visible
        for (i=0; i < this.oldVisibleSprites.length; i++) {
            sprite = this.oldVisibleSprites[i];

            if (this.visibleSprites.indexOf(sprite) < 0) {
                sprite.visible = false;
                sprite.img.style.display = "none";
            }
        }
    };

    return fn;

}));
