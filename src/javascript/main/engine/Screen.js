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

    /**
     * Init the screen and determine the size of strip.
     *
     * @return void
     */
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

    /**
     * Add sprites on the screen.
     *
     * @param App.engine.Sprites
     *
     * @return void
     */
    fn.prototype.addSprites = function(sprites) {
        this.sprites = sprites;
    };

    /**
     * Add enemies on the screen.
     *
     * @param App.engine.Enemies
     *
     * @return void
     */
    fn.prototype.addEnemies = function(enemies) {
        this.enemies = enemies;
    };

    return fn;

}));
