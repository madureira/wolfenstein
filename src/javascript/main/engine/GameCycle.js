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

    /**
     * Init the game cycle and call itself recursively.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var now = new Date().getTime();

        // Time since last game logic
        var timeDelta = now - lastGameCycleTime;

        this.player.move(this.miniMap, this.screen, timeDelta, GAME_CYCLE_DELAY);

        this.screen.enemies.ai(timeDelta, this.player, this.miniMap, this.screen, GAME_CYCLE_DELAY);

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

    /**
     * Init the render cycle and call itself recursively.
     *
     * @return void
     */
    fn.prototype.renderCycle = function() {
        this.miniMap.update(this.player);
        this.screen.sprites.clearObjects();
        this.raycasting.castRays();
        this.screen.sprites.renderObjects(this.player, this.raycasting.viewDist, this.screen.screenWidth, this.screen.screenHeight);
        this.screen.enemies.render(this.player, this.raycasting.viewDist, this.screen);

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
