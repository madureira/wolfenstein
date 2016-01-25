/**
 * Prototype responsible to manager a single shoot int the space.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Shoot', 'engine', (function(fn) {
    'use strict';

    var SPRITE_PATH = App.Properties.spritesPath + 'shoot/';

    fn = function(shoot, $selector) {
        console.log('[Shoot] Add a shoot in space');

        this.id = shoot.id;
        this.cssRoot = 'shoot';
        this.x = shoot.positionX;
        this.y = shoot.positionY;
        this.type = shoot.gunType;
        this.state = 0;
        this.rot = 0;
        this.rotDeg = shoot.rotDeg;
        this.dir = 0;
        this.speed = 0;
        this.moveSpeed = 0.050;
        //this.moveSpeed = 0.0100;
        this.rotSpeed = 3;
        this.totalStates = 3;
        this.walkCycleTime = 250;
        this.numWalkSprites = 2;

        var img = $selector.createTag('img');
        img.id = this.id;
        img.src = SPRITE_PATH + 'shoot_' + this.type + '.png';
        img.style.display = 'none';
        img.style.position = 'absolute';
        img.classList.add(this.cssRoot);

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
