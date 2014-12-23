/**
 * Prototype responsible to manage the Raycasting.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Raycasting', 'engine', (function(fn) {
    'use strict';

    var fov         = 60 * Math.PI / 180,
        fovHalf     = fov / 2,
        twoPI       = Math.PI * 2;

    /**
     * Contructor
     *
     * @param App.engine.Player player
     * @param App.engine.MiniMap miniMap
     * @param App.engine.Screen screen
     *
     */
    fn = function(player, miniMap, screen) {
        this.player = player;
        this.miniMap = miniMap;
        this.screen = screen;

        this.numRays     = Math.ceil(this.screen.screenWidth / this.screen.stripWidth);
        this.viewDist    = (this.screen.screenWidth / 2) / Math.tan((fov / 2));
    };

    /**
     * Launches the rays.
     *
     *
     * @return void
     */
    fn.prototype.castRays = function() {
        var stripIdx = 0;
        var self = this;

        for (var i=0; i < this.numRays; i++) {
            // where on the screen does ray go through?
            var rayScreenPos = (-this.numRays / 2 + i) * this.screen.stripWidth;

            // the distance from the viewer to the point on the screen, simply Pythagoras.
            var rayViewDist = Math.sqrt(rayScreenPos * rayScreenPos + this.viewDist * this.viewDist);

            // the angle of the ray, relative to the viewing direction.
            // right triangle: a = sin(A) * c
            var rayAngle = Math.asin(rayScreenPos / rayViewDist);

            _castSingleRay(this.screen, this.player, this.miniMap, this.viewDist, rayAngle, stripIdx++);
        }
    };

    function _castSingleRay(screen, player, miniMap, viewDist, rayAngle, stripIdx) {
        rayAngle = player.rot + rayAngle; // add the players viewing direction to get the angle in world space

        // first make sure the angle is between 0 and 360 degrees
        rayAngle %= twoPI;
        if (rayAngle < 0) rayAngle += twoPI;

        // moving right/left? up/down? Determined by which quadrant the angle is in.
        var right = (rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25);
        var up = (rayAngle < 0 || rayAngle > Math.PI);

        var wallType = 0;

        // only do these once
        var angleSin = Math.sin(rayAngle);
        var angleCos = Math.cos(rayAngle);

        var dist = 0;   // the distance to the block we hit
        var xHit = 0;   // the x and y coord of where the ray hit the block
        var yHit = 0;
        var xWallHit = 0;
        var yWallHit = 0;

        var textureX;   // the x-coord on the texture of the block, ie. what part of the texture are we going to render
        var wallX;  // the (x,y) map coords of the block
        var wallY;

        var wallIsShaded = false;

        var wallIsHorizontal = false;

        // first check against the vertical map/wall lines
        // we do this by moving to the right or left edge of the block we're standing in
        // and then moving in 1 map unit steps horizontally. The amount we have to move vertically
        // is determined by the slope of the ray, which is simply defined as sin(angle) / cos(angle).

        var slope = angleSin / angleCos;    // the slope of the straight line made by the ray
        var dXVer = right ? 1 : -1;    // we move either 1 map unit to the left or right
        var dYVer = dXVer * slope;        // how much to move up or down

        var x = right ? Math.ceil(player.x) : Math.floor(player.x); // starting horizontal position, at one of the edges of the current map block
        var y = player.y + (x - player.x) * slope;          // starting vertical position. We add the small horizontal step we just made, multiplied by the slope.
        var distX = 0;
        var distY = 0;

        while (x >= 0 && x < miniMap.mapWidth && y >= 0 && y < miniMap.mapHeight) {
            wallX = Math.floor(x + (right ? 0 : -1));
            wallY = Math.floor(y);

            if (screen.spriteMap[wallY][wallX] && !screen.spriteMap[wallY][wallX].visible) {
                screen.spriteMap[wallY][wallX].visible = true;
                screen.visibleSprites.push(screen.spriteMap[wallY][wallX]);
            }

            // is this point inside a wall block?
            if (miniMap.level.map[wallY][wallX] > 0) {

                distX = x - player.x;
                distY = y - player.y;
                dist = (distX * distX) + (distY * distY);   // the distance from the player to this point, squared.

                wallType = miniMap.level.map[wallY][wallX]; // we'll remember the type of wall we hit for later
                textureX = y % 1;   // where exactly are we on the wall? textureX is the x coordinate on the texture that we'll use when texturing the wall.
                if (!right) textureX = 1 - textureX; // if we're looking to the left side of the map, the texture should be reversed

                xHit = x;   // save the coordinates of the hit. We only really use these to draw the rays on minimap.
                yHit = y;
                xWallHit = wallX;
                yWallHit = wallY;

                // make horizontal walls shaded
                wallIsShaded = true;

                wallIsHorizontal = true;

                break;
            }
            x += dXVer;
            y += dYVer;
        }


        // now check against horizontal lines. It's basically the same, just "turned around".
        // the only difference here is that once we hit a map block, 
        // we check if there we also found one in the earlier, vertical run. We'll know that if dist != 0.
        // If so, we only register this hit if this distance is smaller.

        slope = angleCos / angleSin;    // the slope of the straight line made by the ray
        var dYHor = up ? -1 : 1;
        var dXHor = dYHor * slope;
        y = up ? Math.floor(player.y) : Math.ceil(player.y);
        x = player.x + (y - player.y) * slope;

        while (x >= 0 && x < miniMap.mapWidth && y >= 0 && y < miniMap.mapHeight) {
            wallY = Math.floor(y + (up ? -1 : 0));
            wallX = Math.floor(x);

            if (screen.spriteMap[wallY][wallX] && !screen.spriteMap[wallY][wallX].visible) {
                screen.spriteMap[wallY][wallX].visible = true;
                screen.visibleSprites.push(screen.spriteMap[wallY][wallX]);
            }

            if (miniMap.level.map[wallY][wallX] > 0) {
                distX = x - player.x;
                distY = y - player.y;
                var blockDist = (distX * distX) + (distY * distY);

                if (!dist || blockDist < dist) {
                    dist = blockDist;
                    xHit = x;
                    yHit = y;
                    xWallHit = wallX;
                    yWallHit = wallY;

                    wallType = miniMap.level.map[wallY][wallX];
                    textureX = x % 1;
                    if (up) textureX = 1 - textureX;

                    wallIsShaded = false;
                }
                break;
            }
            x += dXHor;
            y += dYHor;
        }

        if (dist) {
            _drawRay(xHit, yHit, miniMap, player);
            _drawScreen(screen, stripIdx, dist, player, viewDist, rayAngle, wallType, textureX, miniMap.level, wallIsShaded, xWallHit, yWallHit);
        }

    }

    function _drawRay(rayX, rayY, miniMap, player) {
        var objectCtx = miniMap.miniMapObjects.getContext("2d");

        objectCtx.strokeStyle = App.Properties.raycastingColor;
        objectCtx.lineWidth = 0.5;
        objectCtx.beginPath();
        objectCtx.moveTo(player.x * miniMap.miniMapScale, player.y * miniMap.miniMapScale);
        objectCtx.lineTo(
            rayX * miniMap.miniMapScale,
            rayY * miniMap.miniMapScale
        );
        objectCtx.closePath();
        objectCtx.stroke();
    }

    function _drawScreen(screen, stripIdx, dist, player, viewDist, rayAngle, wallType, textureX, level, wallIsShaded, xWallHit, yWallHit) {
        var strip = screen.screenStrips[stripIdx];

        dist = Math.sqrt(dist);

        // use perpendicular distance to adjust for fish eye
        // distorted_dist = correct_dist / cos(relative_angle_of_ray)
        dist = dist * Math.cos(player.rot - rayAngle);

        //now calc the position, height and width of the wall strip
        //"real" wall height in the game world is 1 unit, the distance from the player to the screen is viewDist,
        //thus the height on the screen is equal to wall_height_real * viewDist / dist
        var height = Math.round(viewDist / dist);

        //width is the same, but we have to stretch the texture to a factor of stripWidth to make it fill the strip correctly
        var width = height * screen.stripWidth;

        //top placement is easy since everything is centered on the x-axis, so we simply move
        //it half way down the screen and then half the wall height back up.
        var top = Math.round((screen.screenHeight - height) / 2);

        var imgTop = 0;

        var styleHeight;

        var mapTextures = level.mapTextures;

        var styleSrc = App.Properties.texturesPath;

        var texturesLength = mapTextures.length;

        for (var i=0; texturesLength > i; i++) {
            var current = mapTextures[i];

            if (current.id === (wallType)) {
                if (current.texture) {
                    styleSrc = styleSrc + current.texture;
                    break;
                }
            }
        }

        strip.src = styleSrc;
        strip.oldStyles.src = styleSrc;

        styleHeight = height;

        if (strip.oldStyles.height !== styleHeight) {
            strip.style.height = styleHeight + "px";
            strip.oldStyles.height = styleHeight;
        }

        var texX = Math.round(textureX * width);
        if (texX > width - screen.stripWidth) {
            texX = width - screen.stripWidth;
        }

        texX += (wallIsShaded ? width : 0);

        var styleWidth = Math.floor(width * 2);
        if (strip.oldStyles.width != styleWidth) {
            strip.style.width = styleWidth +"px";
            strip.oldStyles.width = styleWidth;
        }

        var styleTop = top - imgTop;
        if (strip.oldStyles.top !== styleTop) {
            strip.style.top = styleTop + "px";
            strip.oldStyles.top = styleTop;
        }

        var styleLeft = (stripIdx * screen.stripWidth) - texX;
        if (strip.oldStyles.left !== styleLeft) {
            strip.style.left = styleLeft + "px";
            strip.oldStyles.left = styleLeft;
        }

        var styleClip = 'rect(' + imgTop + 'px, ' + (texX + screen.stripWidth)  + 'px, ' + (imgTop + height) + 'px, ' + texX + 'px)';
        if (strip.oldStyles.clip !== styleClip) {
            strip.style.clip = styleClip;
            strip.oldStyles.clip = styleClip;
        }

        var dwx = xWallHit - player.x;
        var dwy = yWallHit - player.y;

        var wallDist = (dwx * dwx) + (dwy * dwy);
        strip.style.zIndex = -Math.floor(wallDist * 1000);
    }

    return fn;

}));
