/**
 * Prototype responsible to manage the hero's face reactions.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('FaceReaction', 'engine', (function(fn) {
    'use strict';

    var FACE_IMG = 'reactions.png',
        SPRITE_PATH = App.Properties.statusbarPath,
        FRAME_TRANSITION_TIME = 500,
        frames = [
            'face01',
            'face02',
            'face03',
            'face02',
            'face01',
            'face01',
            'face01',
            'face02',
            'face02',
            'face03',
            'face03',
            'face01',
            'face03',
            'face01',
            'face02',
            'face03',
            'face02'
        ];

    fn = function($selector) {
        console.log('[FaceReaction] Creating the face reaction');
        this.$ = $selector;
        this.reactions = _createReactionsImage(this.$);
        _startAnimate(this);
    };

    fn.prototype.faces = function() {
        return this.reactions;
    };

    function _startAnimate(self) {

        var interval = FRAME_TRANSITION_TIME*frames.length;
        for(var x=0; x < 100; x++) {
            _animate(self, interval * x);
        }
    }

    function _animate(self, time) {
        var size = frames.length;
        setTimeout(function() {
            for(var i = 0; i < size; i++) {
                _changeFace(self, frames[i], FRAME_TRANSITION_TIME*i);
            }
        }, time);
    }

    function _changeFace(self, face, time) {
        setTimeout(function() {
            self.reactions.className = face;
        }, time);
    }

    function _createReactionsImage($selector) {
        var div = $selector.createTag('div');
        div.id = 'reactions';
        div.className = 'face01';
        return div;
    }

    return fn;

}));
