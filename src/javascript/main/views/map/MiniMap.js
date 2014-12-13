/**
 * Prototype responsible to build the minimap.
 *
 * @param fn contextFunction
 * @param $ selector engine
 * @param tmpl template engine
 *
 * @author rmadureira
 *
 */
App.define('MiniMap', 'views/map', (function(fn, $, tmpl) {
    'use strict';

    var MINI_MAP = 'minimap';
    var MINI_MAP_OBJECT = 'minimapobjects';
    var MINI_MAP_SCALE = 8;

    var mapWidth = 0;
    var mapHeight = 0;

    /**
     * build the miniMap.
     *
     * @return void
     */
    fn.prototype.init = function() {
        this.map = App.maps.firstLevel;
        mapWidth = this.map[0].length;
        mapHeight = this.map.length;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.miniMapScale = MINI_MAP_SCALE;

        _drawMiniMap(this.map);
    };

    /**
     * Redraw the miniMap and position player again.
     *
     * @param App.engine.Player player
     *
     * @return void
     */
    fn.prototype.update = function(player) {
        var miniMap = $(MINI_MAP);

        this.miniMapObjects = $(MINI_MAP_OBJECT);

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

    function _drawMiniMap(map) {
        // draw the topdown view minimap
        var miniMap = $(MINI_MAP);
        var miniMapObjects = $(MINI_MAP_OBJECT);

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
                var wall = map[y][x];

                // If there is a wall block at this (x,y)…
                if (wall > 0) {
                    ctx.fillStyle = 'rgb(200,200,200)';

                    // …Then draw a block on the minimap
                    ctx.fillRect(
                        x * MINI_MAP_SCALE,
                        y * MINI_MAP_SCALE,
                        MINI_MAP_SCALE, MINI_MAP_SCALE
                    );
                }
            }
        }
    }

    return fn;

}));
