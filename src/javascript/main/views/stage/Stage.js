/**
 * Prototype responsible to build the stage.
 *
 * @param fn contextFunction
 * @param $ selector engine
 * @param tmpl template engine
 *
 * @author rmadureira
 *
 */
App.define('Stage', 'views/stage', (function(fn, $, tmpl) {
    'use strict';

    var MiniMap = App.engine.MiniMap,
        Screen = App.engine.Screen,
        GameCycle = App.engine.GameCycle,
        Player = App.engine.Player,
        Raycasting = App.engine.Raycasting;

    /**
     * Build the stage.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var $stage = $.byId(App.container);
        _buildHTMLElements($stage);
        _initGameCycle();
    };

    function _buildHTMLElements($stage) {
        $stage.innerHTML += tmpl.screen();
        $stage.innerHTML += tmpl.mini_map();
        $stage.innerHTML += tmpl.fps_debug();
    }

    function _initGameCycle() {
        var levelMap = App.maps.firstLevel;
        var miniMap = new MiniMap(levelMap, $);
        miniMap.init();

        var screen = new Screen($);
        screen.init();

        var gameCycle = new GameCycle();
        var player = new Player();

        var raycasting = new Raycasting(player, miniMap, screen);

        var cycle = gameCycle.setElements(player, miniMap, screen, raycasting);
        cycle.init();
        cycle.renderCycle();
    }

    return fn;

}));
