/**
 * Prototype responsible to manage the Player actions.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Player', 'engine', (function(fn) {
    'use strict';

    /**
     * Sets default attributes
     */
    fn = function(playerX, playerY) {
        console.log('[Player] Creating a Player');

        this.x = playerX;
        this.y = playerY;

        // The direction that the player is turning,
        // either -1 for left or 1 for right
        this.dir = 0;

        // The current angle of rotation
        this.rot = 0;

        // Add rotation if player is rotating (player.dir != 0)
        this.rotDeg = 0;

        // Is the playing moving forward (speed = 1)
        // or backwards (speed = -1).
        this.speed = 0;

        this.moveSpeed = App.Properties.playerSpeed;

        this.rotSpeed = App.Properties.playerRotateSpeed;

        this.setControls();

        this.entity = new App.engine.Entity();
    };

    /**
     * Move the player.
     *
     * @param App.engine.MiniMap miniMap
     * @param Integer timeDelta
     * @param Integer gameCycleDelay
     *
     * @return void;
     */
    fn.prototype.move = function(miniMap, screen, timeDelta, gameCycleDelay) {
        this.entity.move(this, timeDelta, miniMap, screen, gameCycleDelay);
    };

    /**
     * Bind the key events.
     *
     * @return void
     */
    fn.prototype.setControls = function() {
        var controls = new App.engine.Controls();

        controls.keyboardMap(this);
    };

    return fn;

}));
