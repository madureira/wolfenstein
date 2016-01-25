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
        StatusBar = App.engine.StatusBar,
        Sound = App.engine.Sound,
        GameEvents = App.engine.GameEvents,
        BG_SOUND_PATH = App.Properties.soundPath + 'levels/';

    /**
     * Build the stage.
     *
     * @return void
     */
    fn.prototype.init = function() {
        var body;
        if (!App.Helpful.isNodeWebkit()) {
            body = $.getByTag('body');
            body.className = 'in-browser';
        }
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

        var bgSound = levelMap.backgroundSound;
        var levelSound = new Sound($);
        levelSound.init(bgSound.id, BG_SOUND_PATH + bgSound.track, true, true);

        var gameEvents = new GameEvents($);

        // set game events to be accessed globaly
        document.gameEvents = gameEvents;

        gameCycle.setElements(player, miniMap, screen, raycasting, statusBar, levelSound, gameEvents);
        gameCycle.init();
        gameCycle.renderCycle();
    }

    return fn;

}));
