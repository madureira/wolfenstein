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
    fps: 30,
    playerSpeed: 0.20,
    raycastingColor: 'rgba(0,100,0,0.3)',

    screenWidth: 320,
    screenHeight: 200,
    stripWidth: 2,

    miniMapElementId: 'minimap',
    miniMapObjectElementId: 'minimapobjects',
    miniMapScale: 8,
    miniMapBlocksColor: 'rgb(200,200,200)',
    miniMapDebugMode: false

};
