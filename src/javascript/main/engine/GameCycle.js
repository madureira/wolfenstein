/**
 * Prototype responsible to manage the game live cycle.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('GameCycle', 'engine', (function(fn) {
    'use strict';

    var FPS = App.Properties.fps;

    fn = function() {
        console.log('[GameCycle] Creating the Game Cycle');
    };

    /**
     * Set elements in game cycle and expose a method to init the cycle.
     *
     * @param App.engine.Player player
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Raycasting raycasting
     *
     * @return Function init
     */
    fn.prototype.setElements = function(player, miniMap, screen, raycasting) {
        this.player = player;
        this.miniMap = miniMap;
        this.raycasting = raycasting;
        this.screen = screen;

        App.engine.GameCycle.prototype.init = function() {
            var self = this;
            this.player = self.player;
            this.miniMap = self.miniMap;
            this.raycasting = self.raycasting;
            this.screen = self.screen;

            var timer = 1000/FPS;
            //var timer = 3000;

            setTimeout(function() {
                self.init();
                self.player.move(self.miniMap);
                self.miniMap.update(self.player);
                self.raycasting.castRays();
            }, timer);
        };

        // expose private method as public after set the player.
        return this;
    };

    return fn;

}));
