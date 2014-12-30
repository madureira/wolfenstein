/**
 * Prototype responsible to manager a enemy type of guard.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Guard', 'engine/enemies', (function(fn) {
    'use strict';

    var spriteName = 'guard.png';

    fn = function(enemy, $selector) {
        console.log('[Guard] Add guard');

        var img = $selector.byTag('img');

        img.src = App.Properties.spritesPath + spriteName;
        img.style.display = "none";
        img.style.position = "absolute";

        return img;
    };

    return fn;

}));
