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
        this.fpsDebug = new App.engine.FPSDebug();
    };

    fn.prototype.init = function() {
        var now = new Date().getTime();

        // Time since last game logic
        var timeDelta = now - lastGameCycleTime;

        this.player.move(this.miniMap, timeDelta, GAME_CYCLE_DELAY);

        var cycleDelay = GAME_CYCLE_DELAY;

        // The timer will likely not run that fast
        // due to the rendering cycle hogging the CPU
        // so figure out how much time was lost since last cycle
        if (timeDelta > cycleDelay) {
            cycleDelay = Math.max(1, cycleDelay - (timeDelta - cycleDelay));
        }

        var self = this;

        setTimeout(function() {
            self.init();
        }, cycleDelay);

        lastGameCycleTime = now;
    };

    fn.prototype.renderCycle = function() {
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

        var self = this;

        setTimeout(function() {
            self.renderCycle();
        }, cycleDelay);

        this.fpsDebug.update(1000 / timeDelta);
    };

    return fn;

}));
