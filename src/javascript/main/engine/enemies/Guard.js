/**
 * Prototype responsible to manager a enemy type of guard.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Guard', 'engine/enemies', (function(fn) {
    'use strict';

    var SPRITE_NAME = 'guard_tmp.png',
        SPRITE_PATH = App.Properties.spritesPath;

    fn = function(enemy, $selector) {
        console.log('[Guard] Add guard');

        this.x = enemy.positionX;
        this.y = enemy.positionY;
        this.state = 0;
        this.rot = 0;
        this.rotDeg = 0;
        this.dir = 0;
        this.speed = 0;
        this.moveSpeed = 0.05;
        this.rotSpeed = 3;
        this.totalStates = 7;

        var img = $selector.byTag('img');

        img.src = SPRITE_PATH + SPRITE_NAME;
        img.style.display = 'none';
        img.style.position = 'absolute';

        this.oldStyles = _getOldStyle();
        this.img = img;

        return this;
    };

    function _getOldStyle() {
        return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            clip: "",
            display: "none",
            zIndex: 0
        };
    }

    return fn;

}));
