/**
 * Prototype responsible to build the stage.
 *
 * @param fn contextFunction
 * @param $ selector engine
 * @param tmpl template engine
 *
 * @author madureira
 *
 */
App.define('Stage', 'views/stage', (function(fn, $, tmpl) {
    'use strict';

    var MiniMap = App.engine.MiniMap,
        Screen = App.engine.Screen,
        GameCycle = App.engine.GameCycle,
        Player = App.engine.Player,
        Raycasting = App.engine.Raycasting,
        Sprites = App.engine.Sprites,
        Enemies = App.engine.Enemies,
        StatusBar = App.engine.StatusBar;

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

        var sprites = new Sprites($);
        sprites.init(levelMap.map, levelMap.objects);

        var enemies = new Enemies($);
        enemies.init(levelMap.enemies);

        screen.addSprites(sprites);
        screen.addEnemies(enemies);

        var gameCycle = new GameCycle();
        var player = new Player(levelMap.playerX, levelMap.playerY);

        var raycasting = new Raycasting(player, miniMap, screen);

        var statusBar = new StatusBar($);

        gameCycle.setElements(player, miniMap, screen, raycasting, statusBar);
        gameCycle.init();
        gameCycle.renderCycle();
    }

    return fn;

}));
