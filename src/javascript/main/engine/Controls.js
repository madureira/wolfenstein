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

    var MAP_ENABLED = false;
    var FPS_DISPLAY_ENABLED = false;

    fn = function() {
        // up, W
        this.forwardKey = [38, 87];

        // down, S
        this.backwardKey = [40, 83];

        // right, D
        this.rightKey = [39, 68];

        // left, A
        this.leftKey = [37, 65];

        // M
        this.enableMap = 77;

        // F
        this.enableFPSDisplay = 70;
    };

    /**
     * Defines the keyboard map.
     *
     * @param App.engine.Player player
     */
    fn.prototype.keyboardMap = function(player) {
        var self = this;

        var $selector = App.Properties.selectorEngine;

        var $minimap = $selector.byId('minimap-container');
        var $fpsDisplay = $selector.byId('fps-debug');

        document.onkeydown = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                    player.speed = 1;
                    break;

                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = -1;
                    break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                    player.dir = -1;
                    break;

                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 1;
                    break;

                case self.enableMap:
                    if (MAP_ENABLED) {
                        MAP_ENABLED = false;
                        $minimap.style.display = 'none';
                    } else {
                        MAP_ENABLED = true;
                        $minimap.style.display = 'block';
                    }
                    break;

                case self.enableFPSDisplay:
                    if (FPS_DISPLAY_ENABLED) {
                        FPS_DISPLAY_ENABLED = false;
                        $fpsDisplay.style.display = 'none';
                    } else {
                        FPS_DISPLAY_ENABLED = true;
                        $fpsDisplay.style.display = 'block';
                    }
                    break;
            }
        };

        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case self.forwardKey[0]:
                case self.forwardKey[1]:
                case self.backwardKey[0]:
                case self.backwardKey[1]:
                    player.speed = 0;
                    break;

                case self.leftKey[0]:
                case self.leftKey[1]:
                case self.rightKey[0]:
                case self.rightKey[1]:
                    player.dir = 0;
                    break;
            }
        };
    };

    return fn;

}));
