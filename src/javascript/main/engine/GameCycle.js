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

    var GAME_CYCLE_DELAY = 1000/FPS;
    //var GAME_CYCLE_DELAY = 3000;

    var lastGameCycleTime = 0;
    var lastRenderCycleTime = 0;

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
            var now = new Date().getTime();

            // Time since last game logic
            var timeDelta = now - lastGameCycleTime;

            var self = this;
            this.player = self.player;

            self.player.move(self.miniMap, timeDelta, GAME_CYCLE_DELAY);

            this.miniMap = self.miniMap;
            this.raycasting = self.raycasting;
            this.screen = self.screen;

            var cycleDelay = GAME_CYCLE_DELAY;

            // The timer will likely not run that fast
            // due to the rendering cycle hogging the CPU
            // so figure out how much time was lost since last cycle
            if (timeDelta > cycleDelay) {
                cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
            }

            lastGameCycleTime = now;

            setTimeout(function() {
                self.init();
            }, cycleDelay);
        };


        App.engine.GameCycle.prototype.renderCycle = function() {
            var self = this;

            this.miniMap.update(this.player);
            this.raycasting.castRays();

            // time since last rendering
            var now = new Date().getTime();
            var timeDelta = now - lastRenderCycleTime;
            var cycleDelay = GAME_CYCLE_DELAY;

            if (timeDelta > cycleDelay) {
                cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
            }

            lastRenderCycleTime = now;

            setTimeout(function() {
                self.renderCycle();
            }, cycleDelay);

            //fps = 1000 / timeDelta;
            //if (showOverlay) {
                //updateOverlay();
            //}
        };

        // expose private method as public after set the player.
        return this;
    };

    return fn;

}));
