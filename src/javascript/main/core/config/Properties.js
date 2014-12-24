// Defines the namespace container
var App = App || {};

App.maps = App.maps || {};

App.Properties = {

    container: 'stage',

    selectorEngine: (function() {
        return {
            byId: function(id) {
                return document.getElementById(id);
            },
            byTag: function(tagName) {
                return document.createElement(tagName);
            }
        };
    })(),

    templateEngine: App.template,
    texturesPath: 'src/resources/textures/',
    spritesPath: 'src/resources/sprites/',
    fps: 30,

    playerSpeed: 0.18,

    playerRotateSpeed: 3,

    raycastingColor: 'rgba(0,100,0,0.3)',

    screenWidth: 720,
    screenHeight: 480,
    stripWidth: 2,

    miniMapElementId: 'minimap',
    miniMapObjectElementId: 'minimapobjects',
    miniMapScale: 4,
    miniMapBlocksColor: '#000',
    miniMapDebugMode: false

};
