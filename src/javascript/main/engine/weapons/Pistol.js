/**
 * Prototype responsible to represent the pistol.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Pistol', 'engine/weapons', (function(fn) {
    'use strict';

    var SPRITE_PATH = App.Properties.statusbarPath + 'pistol/',
        FRAME_TRANSITION_TIME = 50,
        remainingFrames = 0;

    fn = function($) {
        this.$ = $;
    };

    fn.prototype.init = function() {
        this.frames = [
            'pistol_0.png',
            'pistol_4.png',
            'pistol_1.png',
            'pistol_2.png',
            'pistol_3.png',
            'pistol_1.png',
            'pistol_4.png',
            'pistol_0.png'
        ];

        _preLoadImages(this.frames);
        _rest(this);
    };

    fn.prototype.shoot = function() {
        if (remainingFrames === 0) {
            var self = this;
            var size = self.frames.length;

            remainingFrames = size;
            for (var i = 0; i < size; i++) {
                _animate(self, self.img, self.frames[i], FRAME_TRANSITION_TIME * i);
            }
        }
    };

    function _preLoadImages(frames) {
        var size = frames.length;
        for (var i = 0; i < size; i++) {
            var image = new Image();
            image.src = SPRITE_PATH + frames[i];
        }
    }

    function _animate(self, img, frame, time) {
        setTimeout(function() {
            img.src = SPRITE_PATH + frame;
            remainingFrames = --remainingFrames;
        }, time);
    }

    function _rest(self) {
        var img = self.$.byTag('img');
        img.src = SPRITE_PATH + 'pistol_0.png';
        img.id = 'weapon';
        img.className = 'pistol';
        self.img = img;
    }

    return fn;

}));
