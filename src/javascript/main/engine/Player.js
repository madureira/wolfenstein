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

    fn = function() {
        console.log('[Player] Creating a Player');
        // Current x, y position of the player
        this.x = 16;
        this.y = 10;

        // The direction that the player is turning,
        // either -1 for left or 1 for right
        this.dir = 0;

        // The current angle of rotation
        this.rot = 0;

        // Is the playing moving forward (speed = 1)
        // or backwards (speed = -1).
        this.speed = 0;

        // How far (in map units) does
        // the player move each step/update
        this.moveSpeed = 0.18;

        // How much does the player rotate each
        // step/update (in radians)
        this.rotSpeed = 6 * Math.PI / 180;

        this.setControls();
    };

    /**
     * Move the player.
     *
     * @param App.engine.MiniMap miniMap
     *
     * @return void;
     */
    fn.prototype.move = function(miniMap) {
        // Player will move this far along
        // the current direction vector
        var moveStep = this.speed * this.moveSpeed;

        // Add rotation if player is rotating (player.dir != 0)
        this.rot += this.dir * this.rotSpeed;

        // Calculate new player position with simple trigonometry
        var newX = this.x + Math.cos(this.rot) * moveStep;
        var newY = this.y + Math.sin(this.rot) * moveStep;

        // Detect collision
        if (_isColliding(newX, newY, miniMap)) {
            return;
        }

        // Set new position
        this.x = newX;
        this.y = newY;
    };

    /**
     * Bind the key events.
     *
     * @return void
     */
    fn.prototype.setControls = function() {
        var self = this;

        var direction = new App.engine.Controls();

        document.onkeydown = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case direction.forwardKey:
                    self.speed = 1; break;

                case direction.backwardKey:
                    self.speed = -1; break;

                case direction.leftKey:
                    self.dir = -1; break;

                case direction.rightKey:
                    self.dir = 1; break;
            }
        };

        document.onkeyup = function(e) {
            e = e || window.event;
            switch (e.keyCode) {
                case direction.forwardKey:
                case direction.backwardKey:
                    self.speed = 0; break;

                case direction.leftKey:
                case direction.rightKey:
                    self.dir = 0; break;
            }
        };
    };

    function _isColliding(playerX, playerY, miniMap) {
        //first make sure that we cannot move outside the boundaries of the level
        if (playerY < 0 || playerY > miniMap.mapHeight || playerX < 0 || playerX > miniMap.mapWidth)
            return true;

        // return true if the map block is not 0, ie. if there is a blocking wall.
        return (miniMap.map[Math.floor(playerY)][Math.floor(playerX)] !== 0); 
    }

    return fn;

}));
