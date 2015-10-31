/**
 * Prototype responsible to build the minimap.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('MiniMap', 'engine', (function(fn) {
    'use strict';

    var MINI_MAP = App.Properties.miniMapElementId;
    var MINI_MAP_OBJECT = App.Properties.miniMapObjectElementId;
    var MINI_MAP_SCALE = App.Properties.miniMapScale;

    var mapWidth = 0;
    var mapHeight = 0;

    var WALL_BLOCKS_COLOR = App.Properties.miniMapBlocksColor;

    var DEBUG_MODE = App.Properties.miniMapDebugMode;
    var BLOCK_TO_DRAW_IN_DEBUG_MODE = 1;

    fn  = function(levelMap, $selector) {
        console.log('[MiniMap] Creating the mini map');
        this.level = levelMap;
        this.$selector = $selector;
    };

    /**
     * build the miniMap.
     *
     * @return void
     */
    fn.prototype.init = function() {
        mapWidth = this.level.map[0].length;
        mapHeight = this.level.map.length;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.miniMapScale = MINI_MAP_SCALE;

        _drawMiniMap(this.level, this.$selector);
    };

    /**
     * Redraw the miniMap and position player again.
     *
     * @param App.engine.Player player
     *
     * @return void
     */
    fn.prototype.update = function(player) {
        var miniMap = this.$selector.byId(MINI_MAP);

        this.miniMapObjects = this.$selector.byId(MINI_MAP_OBJECT);

        var objectCtx = this.miniMapObjects.getContext("2d");
        objectCtx.clearRect(0, 0, miniMap.width, miniMap.height);

        objectCtx.fillRect(
            // draw a dot at the current player position
            player.x * this.miniMapScale - 2,
            player.y * this.miniMapScale - 2,
            4, 4
        );

        objectCtx.beginPath();
        objectCtx.moveTo(player.x * this.miniMapScale, player.y * this.miniMapScale);
        objectCtx.lineTo(
            (player.x + Math.cos(player.rot) * 4) * this.miniMapScale,
            (player.y + Math.sin(player.rot) * 4) * this.miniMapScale
        );

        objectCtx.closePath();
        objectCtx.stroke();
    };

    function _drawMiniMap(level, $selector) {
        // draw the topdown view minimap
        var miniMap = $selector.byId(MINI_MAP);
        var miniMapObjects = $selector.byId(MINI_MAP_OBJECT);

        miniMap.width = mapWidth * MINI_MAP_SCALE; // resize the internal canvas dimensions
        miniMap.height = mapHeight * MINI_MAP_SCALE;
        miniMapObjects.width = miniMap.width;
        miniMapObjects.height = miniMap.height;


        var w = (mapWidth * MINI_MAP_SCALE) + "px";     // resize the canvas CSS dimensions
        var h = (mapHeight * MINI_MAP_SCALE) + "px";     // resize the canvas CSS dimensions

        miniMap.style.width = miniMapObjects.style.width = w;
        miniMap.style.height = miniMapObjects.style.height = h;

        // Loop through all blocks on the map
        var ctx = miniMap.getContext('2d');
        for (var y=0; y < mapHeight; y++) {
            for (var x=0; x < mapWidth; x++) {
                var wall = level.map[y][x];

                // If there is a wall block at this (x,y)…
                if (wall > 0) {
                    ctx.fillStyle = WALL_BLOCKS_COLOR;

                    // …Then draw a block on the minimap
                    _draw(ctx, x, y);
                }
            }
        }
    }

    function _draw(ctx, x, y) {
        if (DEBUG_MODE) {
            var speedPaint = 25;
            var timeToCall = BLOCK_TO_DRAW_IN_DEBUG_MODE * speedPaint;
            BLOCK_TO_DRAW_IN_DEBUG_MODE++;

            setTimeout(function() {
                _paint(ctx, x, y);
            }, timeToCall);
        } else {
            _paint(ctx, x, y);
        }
    }

    function _paint(ctx, x, y) {
        ctx.fillRect(
            x * MINI_MAP_SCALE,
            y * MINI_MAP_SCALE,
            MINI_MAP_SCALE, MINI_MAP_SCALE
        );
    }

    return fn;

}));
