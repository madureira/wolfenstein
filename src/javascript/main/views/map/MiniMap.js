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

    var elemName = 'minimap';

    var map = App.maps.firstLevel;
    var mapWidth = 0;
    var mapHeight = 0;
    var miniMapScale = 8;

    fn.prototype.init = function() {
        mapWidth = map[0].length;
        mapHeight = map.length;

        _drawMiniMap();
    };

    function _drawMiniMap() {
        // draw the topdown view minimap
        var miniMap = $(elemName);

        miniMap.width = mapWidth * miniMapScale; // resize the internal canvas dimensions
        miniMap.height = mapHeight * miniMapScale;

        miniMap.style.width = (mapWidth * miniMapScale) + "px";     // resize the canvas CSS dimensions

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
                        x * miniMapScale,
                        y * miniMapScale,
                        miniMapScale, miniMapScale
                    );
                }
            }
        }
    }

    return fn;

}));
