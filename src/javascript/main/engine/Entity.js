App.define('Entity', 'engine', (function(fn) {
    'use strict';

    fn = function() {
        this.collision = new App.engine.Collision();
    };

    fn.prototype.move = function(entity, timeDelta, miniMap, screen, gameCycleDelay) {
        // time timeDelta has passed since we moved last time. We should have moved after time gameCycleDelay,
        // so calculate how much we should multiply our movement to ensure game speed is constant
        var mul = timeDelta / gameCycleDelay;

        var moveStep = mul * entity.speed * entity.moveSpeed; // entity will move this far along the current direction vector

        entity.rotDeg += mul * entity.dir * entity.rotSpeed; // add rotation if entity is rotating (entity.dir != 0)
        entity.rotDeg %= 360;

        if (entity.rotDeg < -180) {
            entity.rotDeg += 360;
        }

        if (entity.rotDeg >= 180) {
            entity.rotDeg -= 360;
        }

        var snap = (entity.rotDeg+360) % 90;
        if (snap < 2 || snap > 88) {
            entity.rotDeg = Math.round(entity.rotDeg / 90) * 90;
        }

        entity.rot = entity.rotDeg * Math.PI / 180;

        var newX = entity.x + Math.cos(entity.rot) * moveStep;  // calculate new entity position with simple trigonometry
        var newY = entity.y + Math.sin(entity.rot) * moveStep;

        var pos = this.collision.checkCollision(entity.x, entity.y, newX, newY, 0.35, miniMap, screen);

        // set new position
        entity.x = pos.x;
        entity.y = pos.y;
    };

    return fn;

}));
