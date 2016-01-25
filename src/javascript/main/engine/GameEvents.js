/**
 * Prototype responsible to manager all game events.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('GameEvents', 'engine', (function(fn) {
    'use strict';

    fn = function($selector) {
        console.log('[GameEvents] Preparing to manager all game events');
        this.$selector = $selector;
        this.playerShoots = [];
        this.entity = new App.engine.Entity();
    };

    fn.prototype.process = function(player, viewDist, screen, miniMap, gameCycleDelay, timeDelta) {
        var self = this;

        if (this.playerShoots.length > 0) {
            for (var i=0; this.playerShoots.length > i; i++) {
                var shoot = this.playerShoots[i];

                var collided = _renderShoot(shoot, this.entity, player, viewDist, screen, miniMap, gameCycleDelay, timeDelta);

                if (collided) {
                    console.log('>>>>>X<<<<<<');
                    this.$selector.removeById(shoot.id);
                    delete this.playerShoots[i];
                }
            }
        }
    };

    fn.prototype.postEvent = function(eventObject) {
        var $screen = this.$selector.byId('screen');

        if (eventObject.type === 'PLAYER_SHOOT') {
            var shootData = {
                id: 'shoot-' + _idGenerator(),
                positionX: eventObject.x,
                positionY: eventObject.y,
                rotDeg: eventObject.rotDeg,
                gunType: eventObject.gunType,
                moveSpeed: eventObject.moveSpeed,
                speed: eventObject.speed
            };

            var shoot = new App.engine.Shoot(shootData, this.$selector);

            this.playerShoots.push(shoot);

            $screen.appendChild(shoot.img);
        }
    };

    function _renderShoot(shoot, entity, player, viewDist, screen, miniMap, gameCycleDelay, timeDelta) {
        if (shoot === undefined) {
            return false;
        }

        var sameX = player.x === shoot.x;
        var sameY = player.y === shoot.y;
        var sameRot = player.rotDeg === shoot.rotDeg;

        console.log('Player: x='+player.x+' | y='+player.y+' | rot='+player.rotDeg);
        console.log('Shoot:  x='+shoot.x+' | y='+shoot.y+' | rot='+shoot.rotDeg);
        console.log('SameX: ' + sameX, ' | SameY: ' + sameY+ ' | SameRot: ' + sameRot);
        console.log('');

        var img = shoot.img;

        var dx = shoot.x - player.x;
        var dy = shoot.y - player.y;

        var angle = Math.atan2(dy, dx) - player.rot;

        if (angle < -Math.PI) {
            angle += 2 * Math.PI;
        }

        if (angle >= Math.PI) {
            angle -= 2 * Math.PI;
        }

        var distSquared = 0;
        var dist = 0;
        var size = 0;
        var x = Math.tan(angle) * viewDist;
        var style = null;
        var oldStyles = null;
        var styleWidth = null;
        var styleTop = null;
        var styleLeft = null;
        var styleZIndex = 0;
        var styleDisplay = 'none';
        var styleClip = null;

        if (angle > -Math.PI * 0.5 && angle < Math.PI * 0.5) {
            distSquared = dx*dx + dy*dy;
            dist = Math.sqrt(distSquared);
            size = viewDist / (Math.cos(angle) * dist);

            if (size <= 0) {
                return false;
            }

            x = Math.tan(angle) * viewDist;

            style = img.style;
            oldStyles = shoot.oldStyles;

            // height is equal to the sprite size
            if (size !== oldStyles.height) {
                style.height =  size + 'px';
                oldStyles.height = size;
            }

            // width is equal to the sprite size times the total number of states
            styleWidth = size * shoot.totalStates;

            if (styleWidth !== oldStyles.width) {
                style.width = styleWidth + 'px';
                oldStyles.width = styleWidth;
            }

            // top position is halfway down the screen, minus half the sprite height
            styleTop = ((screen.screenHeight - size) / 2);
            if (styleTop != oldStyles.top) {
                style.top = styleTop + 'px';
                oldStyles.top = styleTop;
            }

            // place at x position, adjusted for sprite size and the current sprite state
            styleLeft = (screen.screenWidth / 2 + x - size/2 - size * shoot.state);
            if (styleLeft !== oldStyles.left) {
                style.left = styleLeft + 'px';
                oldStyles.left = styleLeft;
            }

            styleZIndex = -(distSquared * 1000) >> 0;
            if (styleZIndex !== oldStyles.zIndex) {
                style.zIndex = styleZIndex;
                oldStyles.zIndex = styleZIndex;
            }

            styleDisplay = 'block';
            if (styleDisplay !== oldStyles.display) {
                style.display = styleDisplay;
                oldStyles.display = styleDisplay;
            }

            styleClip = 'rect(0px, ' + (size*(shoot.state+1)) + 'px, ' + size + 'px, ' + (size*(shoot.state)) + 'px)';
            if (styleClip !== oldStyles.clip) {
                style.clip = styleClip;
                oldStyles.clip = styleClip;
            }
        } else {
            styleDisplay = 'none';
            if (styleDisplay !== shoot.oldStyles.display) {
                img.style.display = styleDisplay;
                shoot.oldStyles.display = styleDisplay;
            }
        }

        dx = player.x - shoot.x;
        dy = player.y - shoot.y;
        dist = Math.sqrt(dx*dx + dy*dy);

        angle = Math.atan2(dy, dx);
        shoot.state = Math.floor((new Date() % shoot.walkCycleTime) / (shoot.walkCycleTime / shoot.numWalkSprites)) + 1;

        var oldX = shoot.x;
        var oldY = shoot.y;

        var collided = false;

        entity.move(shoot, timeDelta, miniMap, screen, gameCycleDelay);

        if (shoot.x === oldX || shoot.y === oldY) {
            collided = true;
        }

        return collided;
    }

    function _idGenerator() {
        var length = 8;
        var timestamp = + new Date();

        var _getRandomInt = function( min, max ) {
            return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        };

        var ts = timestamp.toString();
        var parts = ts.split( "" ).reverse();
        var id = "";

        for( var i = 0; i < length; ++i ) {
            var index = _getRandomInt( 0, parts.length - 1 );
            id += parts[index];
        }

        return id;
    }

    return fn;

}));

