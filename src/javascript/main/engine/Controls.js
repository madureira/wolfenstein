/**
 * Prototype responsible to supply the controls.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Controls', 'engine', (function(fn) {
    'use strict';

    fn = function() {
        this.forwardKey = 38;
        this.backwardKey = 40;
        this.rightKey = 39;
        this.leftKey = 37;
    };

    return fn;

}));
