/**
 * Prototype responsible to supply the controls.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Controls', 'engine', (function(fn) {
    'use strict';

    fn = function() {
        this.forwardKey = 38;
        this.backwardKey = 40;
        this.rightKey = 39;
        this.leftKey = 37;
    };

    /**
     * Defines the keyboard map.
     *
     * @param App.engine.Player player
     */
    fn.prototype.keyboardMap = function(player) {
        var self = this;

        document.onkeydown = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey:
                    player.speed = 1; break;

                case self.backwardKey:
                    player.speed = -1; break;

                case self.leftKey:
                    player.dir = -1; break;

                case self.rightKey:
                    player.dir = 1; break;
            }
        };

        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey:
                case self.backwardKey:
                    player.speed = 0; break;

                case self.leftKey:
                case self.rightKey:
                    player.dir = 0; break;
            }
        };
    };

    return fn;

}));
