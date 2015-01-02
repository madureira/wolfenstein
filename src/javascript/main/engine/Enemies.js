/**
 * Prototype responsible to manager the enemies.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Enemies', 'engine', (function(fn) {
    'use strict';

    var GUARD = 'guard';

    fn = function($selector) {
        console.log('[Enemies] Add enemies');
        this.$selector = $selector;
        this.enemiesList = [];

        this.entity = new App.engine.Entity();
    };

    /**
     * Init the enemies by type.
     *
     * @param App.engine.Enemies enemies
     *
     * @return Objs
     */
    fn.prototype.init = function(enemies) {
        this.enemiesAmount = enemies.length;
        var i = 0;
        var $screen = this.$selector.byId('screen');

        for (i; this.enemiesAmount > i; i++) {
            var enemyData = enemies[i];

            if (enemyData.type === GUARD) {
                var guard = new App.engine.enemies.Guard(enemyData, this.$selector);

                this.enemiesList.push(guard);

                $screen.appendChild(guard.img);
            }
        }
    };

    fn.prototype.render = function(player, viewDist, screen) {
        var i = 0;

        for (i; i < this.enemiesAmount; i++) {
            var enemy = this.enemiesList[i];

            var img = enemy.img;

            var dx = enemy.x - player.x;
            var dy = enemy.y - player.y;

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
                    continue;
                }

                x = Math.tan(angle) * viewDist;

                style = img.style;
                oldStyles = enemy.oldStyles;

                // height is equal to the sprite size
                if (size !== oldStyles.height) {
                    style.height =  size + 'px';
                    oldStyles.height = size;
                }

                // width is equal to the sprite size times the total number of states
                styleWidth = size * enemy.totalStates;

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
                styleLeft = (screen.screenWidth / 2 + x - size/2 - size * enemy.state);
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

                styleClip = 'rect(0px, ' + (size*(enemy.state+1)) + 'px, ' + size + 'px, ' + (size*(enemy.state)) + 'px)';
                if (styleClip !== oldStyles.clip) {
                    style.clip = styleClip;
                    oldStyles.clip = styleClip;
                }
            } else {
                styleDisplay = 'none';
                if (styleDisplay !== enemy.oldStyles.display) {
                    img.style.display = styleDisplay;
                    enemy.oldStyles.display = styleDisplay;
                }
            }
        }
    };

    fn.prototype.ai = function(timeDelta, player, miniMap, screen, gameCycleDelay) {
        var i=0;

        for (i; i < this.enemiesAmount; i++) {
            var enemy = this.enemiesList[i];

            var dx = player.x - enemy.x;
            var dy = player.y - enemy.y;

            var dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 4) {
                var angle = Math.atan2(dy, dx);

                enemy.rotDeg = angle * 180 / Math.PI;
                enemy.rot = angle;
                enemy.speed = 1;

                enemy.state = Math.floor((new Date() % enemy.walkCycleTime) / (enemy.walkCycleTime / enemy.numWalkSprites)) + 1;
            } else {
                enemy.state = 0;
                enemy.speed = 0;
            }

            this.entity.move(enemy, timeDelta, miniMap, screen, gameCycleDelay);
        }
    };

    return fn;

}));
