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

        this.collision = new App.engine.Collision();
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
    fn.prototype.move = function(miniMap, timeDelta, gameCycleDelay) {
        // Time timeDelta has passed since we moved last time
        // We should have moved after time gameCycleDelay,
        // so calculate how much we should multiply our
        // movement to ensure game speed is contant
        var mul = timeDelta / gameCycleDelay;

        // Player will move this far along
        // the current direction vector
        var moveStep = mul * this.speed * this.moveSpeed;

        // Add rotation if player is rotating (player.dir != 0)
        this.rotDeg += mul * this.dir * this.rotSpeed;
        this.rotDeg %= 360;

        var snap = (this.rotDeg + 360) % 90;
        if (snap < 2 || snap > 88) {
            this.rotDeg = Math.round(this.rotDeg / 90) * 90;
        }

        this.rot = this.rotDeg * Math.PI / 180;

        //this.rot += this.dir * this.rotSpeed;

        // Calculate new player position with simple trigonometry
        var newX = this.x + Math.cos(this.rot) * moveStep;
        var newY = this.y + Math.sin(this.rot) * moveStep;

        var pos = this.collision.checkCollision(this.x, this.y, newX, newY, 0.35, miniMap);
        //var pos = { x: newX, y: newY };

        // Set new position
        this.x = pos.x;
        this.y = pos.y;
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
