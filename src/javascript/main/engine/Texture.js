/**
 * Prototype responsible to manage the textures.
 *
 * @param fn contextFunction
 *
 * @author rmadureira
 *
 */
App.define('Texture', 'engine', (function(fn) {
    'use strict';

    var texturesPath = App.Properties.texturesPath;
    var NUMBER_OF_TEXTURES = 4;

    /**
     * Return the texture based on name of image.
     *
     * @param String image
     *
     * @return Image
     */
    fn.prototype.get = function(name) {
        var img = new Image();
        img.src = texturesPath + name + '.png';
        img.style.position = 'absolute';
        img.style.left = '0px';

        return img;
    };

    /**
     * Supply the number of textures.
     *
     * @return Integer
     */
    fn.prototype.getNumberOfTextures = function() {
        return NUMBER_OF_TEXTURES;
    };

    return fn;

}));
