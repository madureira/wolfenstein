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

    var MiniMapView = App.views.map.MiniMap;

    fn.prototype.init = function() {
        _addCanvas();
        _addMiniMap();
    };

    function _addCanvas() {
        var $stage = $(App.container);

        $stage.innerHTML = tmpl.mini_map();
        $stage.innerHTML += tmpl.viewport();
    }

    function _addMiniMap() {
        var mmView = new MiniMapView();
        mmView.init();
    }

    return fn;

}));
