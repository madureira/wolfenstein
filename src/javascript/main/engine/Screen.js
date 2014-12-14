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
    };

    fn.prototype.init = function() {
        var screen = this.$selector.byId('screen');

        for (var i=0; i < this.screenWidth; i += this.stripWidth) {
            var strip = this.$selector.byTag('div');

            strip.style.position = 'absolute';
            strip.style.left = i + 'px';
            strip.style.width = this.stripWidth + 'px';
            strip.style.height = '0px';
            strip.style.overflow = 'hidden';

            strip.style.backgroundColor = 'magenta';

            var texture = new App.engine.Texture();
            var img = texture.get('walls');

            strip.appendChild(img);
            strip.img = img;    // assign the image to a property on the strip element so we have easy access to the image later

            this.screenStrips.push(strip);
            screen.appendChild(strip);
        }
    };

    return fn;

}));
