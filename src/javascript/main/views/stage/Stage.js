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

    var MiniMapView = App.views.map.MiniMap,
        GameCycle = App.engine.GameCycle,
        Player = App.engine.Player,
        Raycasting = App.engine.Raycasting;

    /**
     * Build the stage.
     *
     * @return void
     */
    fn.prototype.init = function() {
        _addCanvas();
        _addMiniMap();
    };

    function _addCanvas() {
        var $stage = $(App.container);

        $stage.innerHTML = tmpl.mini_map();
        $stage.innerHTML += tmpl.mini_map_objects();
    }

    function _addMiniMap() {
        var mmView = new MiniMapView();
        mmView.init();

        _initGameCycle(mmView);
    }

    function _initGameCycle(miniMap) {
        var gameCycle = new GameCycle();
        var player = new Player();
        var raycasting = new Raycasting();

        gameCycle.setElements(player, miniMap, raycasting).init();
    }

    return fn;

}));
