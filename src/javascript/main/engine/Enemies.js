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
    };

    /**
     * Init the enemies by type.
     *
     * @param App.engine.Enemies enemies
     *
     * @return Objs
     */
    fn.prototype.init = function(enemies) {
        var i = 0;
        var enemiesLength = enemies.length;
        var $screen = this.$selector.byId('screen');

        for (i; enemiesLength > i; i++) {
            var enemyData = enemies[i];

            if (enemyData.type === GUARD) {
                var guard = new App.engine.enemies.Guard(enemyData, this.$selector);
                $screen.appendChild(guard);
            }
        }
    };

    return fn;

}));
