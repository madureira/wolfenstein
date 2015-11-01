/**
 * Prototype responsible to play sound in the game.
 *
 * @param fn contextFunction
 *
 * @author madureira
 *
 */
App.define('Sound', 'engine', (function(fn) {
    'use strict';

    var elemId = 'sounds';

    fn = function($selector) {
        this.$ = $selector;
        return this;
    };

    fn.prototype.init = function(id, soundUrl, autoPlay, repeat) {
        this.audio = this.$.createTag('audio');
        this.audio.setAttribute("id", id);
        this.audio.autoplay = autoPlay;
        this.audio.loop = repeat;

        var source = this.$.createTag('source');
        source.setAttribute('src', soundUrl + '.wav');
        source.setAttribute('type', 'audio/wav');

        this.audio.appendChild(source);

        var soundsPanel = this.$.byId(elemId);

        soundsPanel.appendChild(this.audio);
    };

    fn.prototype.play = function() {
        this.audio.play();
    };

    fn.prototype.pause = function() {
        this.audio.pause();
    };

    fn.prototype.reset = function() {
        this.audio.currentTime = 0;
    };

    return fn;

}));
