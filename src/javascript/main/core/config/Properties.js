// Defines the namespace container
var App = App || {};

App.maps = App.maps || {};

App.Properties = {

    //container: '#stage',
    container: 'stage',
    //selectorEngine: jQuery,
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
    fps: 40,

    // How far (in map units) does the player move each step/update
    playerSpeed: 0.10,

    // How much does the player rotate each step/update (in radians)
    playerRotateSpeed: 2,

    raycastingColor: 'rgba(0,100,0,0.3)',

    screenWidth: 720,
    screenHeight: 480,
    stripWidth: 2,

    miniMapElementId: 'minimap',
    miniMapObjectElementId: 'minimapobjects',
    miniMapScale: 8,
    //miniMapBlocksColor: 'rgb(200,200,200)',
    miniMapBlocksColor: '#000',
    miniMapDebugMode: false

};
