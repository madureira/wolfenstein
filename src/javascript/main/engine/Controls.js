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
        // up, W
        this.forwardKey = [38, 87];

        // down, S
        this.backwardKey = [40, 83];

        // right, D
        this.rightKey = [39, 68];

        // left, A
        this.leftKey = [37, 65];
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
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                    player.speed = 1; break;

                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = -1; break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                    player.dir = -1; break;

                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 1; break;
            }
        };

        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = 0; break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 0; break;
            }
        };
    };

    return fn;

}));
