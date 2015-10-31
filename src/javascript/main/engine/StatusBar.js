/**
 * Prototype responsible to manage the status bar of hero..
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('StatusBar', 'engine', (function(fn) {
    'use strict';

    var STATUS_BAR_IMG = 'statusbar.jpg',
        SPRITE_PATH = App.Properties.statusbarPath;


    fn = function($selector) {
        console.log('[StatusBar] Creating the status bar');
        this.$selector = $selector;
        this.weapon = new App.engine.Weapon($selector);
        this.init();
    };

    fn.prototype.init = function() {
        var $screen = this.$selector.byId('screen');
        var statusBar = _createStatusBarImage(this.$selector);

        $screen.appendChild(this.weapon.default());
        $screen.appendChild(statusBar);
    };

    fn.prototype.update = function() {

    };

    function _createStatusBarImage($selector) {
        var img = $selector.byTag('img');
        img.src = SPRITE_PATH + STATUS_BAR_IMG;
        img.id = 'status-bar';
        return img;
    }

    return fn;

}));
