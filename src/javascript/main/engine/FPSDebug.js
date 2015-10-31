/**
 * Prototype responsible to debug FPS.
 *
 * @param fn context function
 *
 * @author madureira
 */
App.define('FPSDebug', 'engine', (function(fn) {
    'use strict';

    var overlay;
    var overlayText = "";

    fn = function() {
        console.log('[FPS debug] Enabled');

        var $selector = App.Properties.selectorEngine;
        this.overlay = $selector.byId('fps-debug');
    };

    /**
     * Update the FPS on the Screen.
     *
     * @param Integer fps
     *
     * @return void
     */
    fn.prototype.update = function(fps) {
        this.overlay.innerHTML = "FPS: " + fps.toFixed(1) + "<br/>" + this.overlayText;
        this.overlayText = "";
    };

    return fn;

}));
