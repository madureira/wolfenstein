/**
 * Prototype responsible to manage the weapon instance for the game.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Weapon', 'engine', (function(fn) {
    'use strict';

    var Pistol;

    fn = function($) {
        console.log('[Weapon] Creating the weapon');

        Pistol = App.engine.weapons.Pistol;
        this.$ = $;
        this.listeningShootEvent();
    };

    fn.prototype.current = function() {
        return this.current;
    };

    fn.prototype.default = function() {
        var pistol = new Pistol(this.$);
        pistol.init();
        this.current = pistol;
        return pistol.img;
    };

    fn.prototype.listeningShootEvent = function() {
        var self = this;
        document.addEventListener('shoot', function (e) {
            self.current.shoot();
        }, false);
    };

    return fn;

}));
