/**
 * Prototype responsible to detect collision.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Collision', 'engine', (function(fn) {
    'use strict';

    fn.prototype.checkCollision = function(fromX, fromY, toX, toY, radius, miniMap) {
        var pos = {
            x : fromX,
            y : fromY
        };

        if (toY < 0 || toY >= miniMap.mapHeight || toX < 0 || toX >= miniMap.mapWidth)
            return pos;

        var blockX = Math.floor(toX);
        var blockY = Math.floor(toY);


        if (_isBlocking(blockX, blockY, miniMap)) {
            return pos;
        }

        pos.x = toX;
        pos.y = toY;

        var blockTop = _isBlocking(blockX, blockY-1, miniMap);
        var blockBottom = _isBlocking(blockX, blockY+1, miniMap);
        var blockLeft = _isBlocking(blockX-1, blockY, miniMap);
        var blockRight = _isBlocking(blockX+1, blockY, miniMap);

        if (blockTop && toY - blockY < radius) {
            toY = pos.y = blockY + radius;
        }
        if (blockBottom && blockY+1 - toY < radius) {
            toY = pos.y = blockY + 1 - radius;
        }
        if (blockLeft && toX - blockX < radius) {
            toX = pos.x = blockX + radius;
        }
        if (blockRight && blockX+1 - toX < radius) {
            toX = pos.x = blockX + 1 - radius;
        }

        var dx = 0;
        var dy = 0;

        // is tile to the top-left a wall
        if (_isBlocking(blockX-1, blockY-1, miniMap) !== 0 && !(blockTop !== 0 && blockLeft !== 0)) {
            dx = toX - blockX;
            dy = toY - blockY;
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy)
                    toX = pos.x = blockX + radius;
                else
                    toY = pos.y = blockY + radius;
            }
        }

        // is tile to the top-right a wall
        if (_isBlocking(blockX+1, blockY-1, miniMap) !== 0 && !(blockTop !== 0 && blockRight !== 0)) {
            dx = toX - (blockX+1);
            dy = toY - blockY;
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy)
                    toX = pos.x = blockX + 1 - radius;
                else
                    toY = pos.y = blockY + radius;
            }
        }

        // is tile to the bottom-left a wall
        if (_isBlocking(blockX-1, blockY+1, miniMap) !== 0 && !(blockBottom !== 0 && blockBottom !== 0)) {
            dx = toX - blockX;
            dy = toY - (blockY+1);
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy)
                    toX = pos.x = blockX + radius;
                else
                    toY = pos.y = blockY + 1 - radius;
            }
        }

        // is tile to the bottom-right a wall
        if (_isBlocking(blockX+1, blockY+1, miniMap) !== 0 && !(blockBottom !== 0 && blockRight !== 0)) {
            dx = toX - (blockX+1);
            dy = toY - (blockY+1);
            if (dx*dx+dy*dy < radius*radius) {
                if (dx*dx > dy*dy)
                    toX = pos.x = blockX + 1 - radius;
                else
                    toY = pos.y = blockY + 1 - radius;
            }
        }

        return pos;
    };

    function _isBlocking(x,y, miniMap) {
        // first make sure that we cannot move outside the boundaries of the level
        if (y < 0 || y >= miniMap.mapHeight || x < 0 || x >= miniMap.mapWidth)
            return true;

        // return true if the map block is not 0, ie. if there is a blocking wall.
        return (miniMap.level.map[Math.floor(y)][Math.floor(x)] !== 0);
    }


    return fn;

}));
